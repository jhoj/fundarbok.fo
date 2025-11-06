using Fundarbok.Application.DTOs.Push;

namespace Fundarbok.Application.Services;

public interface IPushNotificationService
{
    /// <summary>
    /// Subscribe a user to push notifications
    /// </summary>
    Task<bool> SubscribeAsync(Guid userId, PushSubscriptionDto subscription);

    /// <summary>
    /// Unsubscribe a user from push notifications
    /// </summary>
    Task<bool> UnsubscribeAsync(Guid subscriptionId);

    /// <summary>
    /// Send a push notification to a single user
    /// </summary>
    Task<bool> SendNotificationAsync(Guid userId, string title, string body, object? data = null);

    /// <summary>
    /// Send a push notification to multiple users
    /// </summary>
    Task<bool> SendToMultipleAsync(List<Guid> userIds, string title, string body, object? data = null);

    /// <summary>
    /// Get VAPID public key for client subscription
    /// </summary>
    string GetVapidPublicKey();
}
