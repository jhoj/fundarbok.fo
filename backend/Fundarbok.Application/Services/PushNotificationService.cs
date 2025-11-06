using Fundarbok.Application.DTOs.Push;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using WebPush;
using DomainPushSubscription = Fundarbok.Domain.Entities.PushSubscription;

namespace Fundarbok.Application.Services;

public class PushNotificationService : IPushNotificationService
{
    private readonly IConfiguration _configuration;
    private readonly IPushSubscriptionRepository _subscriptionRepository;
    private readonly WebPushClient _webPushClient;
    private readonly string _vapidPublicKey;
    private readonly string _vapidPrivateKey;

    public PushNotificationService(
        IConfiguration configuration,
        IPushSubscriptionRepository subscriptionRepository)
    {
        _configuration = configuration;
        _subscriptionRepository = subscriptionRepository;

        _vapidPublicKey = configuration["Vapid:PublicKey"] ?? throw new InvalidOperationException("VAPID public key not configured");
        _vapidPrivateKey = configuration["Vapid:PrivateKey"] ?? throw new InvalidOperationException("VAPID private key not configured");

        _webPushClient = new WebPushClient();
    }

    public string GetVapidPublicKey() => _vapidPublicKey;

    public async Task<bool> SubscribeAsync(Guid userId, PushSubscriptionDto subscription)
    {
        try
        {
            var existingSubscription = await _subscriptionRepository.GetByUserIdAsync(userId);

            var pushSubscription = new DomainPushSubscription
            {
                Id = existingSubscription?.Id ?? Guid.NewGuid(),
                UserId = userId,
                Endpoint = subscription.Endpoint,
                P256dh = subscription.P256dh,
                Auth = subscription.Auth,
                CreatedAt = existingSubscription?.CreatedAt ?? DateTime.UtcNow
            };

            if (existingSubscription != null)
            {
                await _subscriptionRepository.UpdateAsync(pushSubscription);
            }
            else
            {
                await _subscriptionRepository.CreateAsync(pushSubscription);
            }

            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UnsubscribeAsync(Guid subscriptionId)
    {
        try
        {
            return await _subscriptionRepository.DeleteAsync(subscriptionId);
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendNotificationAsync(Guid userId, string title, string body, object? data = null)
    {
        try
        {
            var subscription = await _subscriptionRepository.GetByUserIdAsync(userId);
            if (subscription == null)
                return false;

            var payload = CreatePayload(title, body, data);
            var browserSubscription = new WebPush.PushSubscription(
                subscription.Endpoint,
                subscription.P256dh,
                subscription.Auth);

            var vapidDetails = new VapidDetails(
                "mailto:admin@fundarbok.fo",
                _vapidPublicKey,
                _vapidPrivateKey);

            await _webPushClient.SendNotificationAsync(browserSubscription, payload, vapidDetails);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendToMultipleAsync(List<Guid> userIds, string title, string body, object? data = null)
    {
        var payload = CreatePayload(title, body, data);
        var vapidDetails = new VapidDetails(
            "mailto:admin@fundarbok.fo",
            _vapidPublicKey,
            _vapidPrivateKey);

        var successCount = 0;
        foreach (var userId in userIds)
        {
            try
            {
                var subscription = await _subscriptionRepository.GetByUserIdAsync(userId);
                if (subscription == null)
                    continue;

                var browserSubscription = new WebPush.PushSubscription(
                    subscription.Endpoint,
                    subscription.P256dh,
                    subscription.Auth);

                await _webPushClient.SendNotificationAsync(browserSubscription, payload, vapidDetails);
                successCount++;
            }
            catch
            {
                // Continue sending to other users if one fails
            }
        }

        return successCount > 0;
    }

    private static string CreatePayload(string title, string body, object? data = null)
    {
        var payload = new
        {
            notification = new
            {
                title = title,
                body = body,
                icon = "/assets/icons/icon-192x192.png",
                badge = "/assets/icons/icon-192x192.png"
            },
            data = data ?? new { }
        };

        return System.Text.Json.JsonSerializer.Serialize(payload);
    }
}
