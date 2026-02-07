using Fundarbok.Application.DTOs.Push;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fundarbok.API.Controllers;

/// <summary>
/// Push notification controller for managing subscriptions and sending notifications
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PushController : ControllerBase
{
    private readonly IPushNotificationService _pushNotificationService;
    private readonly ILogger<PushController> _logger;

    public PushController(IPushNotificationService pushNotificationService, ILogger<PushController> logger)
    {
        _pushNotificationService = pushNotificationService;
        _logger = logger;
    }

    /// <summary>
    /// Get VAPID public key for client subscription
    /// </summary>
    /// <returns>VAPID public key</returns>
    [HttpGet("vapid-public-key")]
    [AllowAnonymous]
    public IActionResult GetVapidPublicKey()
    {
        try
        {
            var publicKey = _pushNotificationService.GetVapidPublicKey();
            return Ok(new { publicKey });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting VAPID public key");
            return StatusCode(500, "Error getting VAPID public key");
        }
    }

    /// <summary>
    /// Subscribe user to push notifications
    /// </summary>
    /// <param name="subscription">Push subscription details</param>
    /// <returns>Success status</returns>
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] PushSubscriptionDto subscription)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId.Value, out var userIdGuid))
                return Unauthorized();

            var result = await _pushNotificationService.SubscribeAsync(userIdGuid, subscription);
            if (result)
                return Ok(new { message = "Subscribed to push notifications" });

            return BadRequest("Failed to subscribe");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error subscribing to push notifications");
            return StatusCode(500, "Error subscribing to push notifications");
        }
    }

    /// <summary>
    /// Unsubscribe user from push notifications
    /// </summary>
    /// <param name="subscriptionId">Subscription ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("unsubscribe/{subscriptionId}")]
    public async Task<IActionResult> Unsubscribe(Guid subscriptionId)
    {
        try
        {
            var result = await _pushNotificationService.UnsubscribeAsync(subscriptionId);
            if (result)
                return Ok(new { message = "Unsubscribed from push notifications" });

            return NotFound("Subscription not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unsubscribing from push notifications");
            return StatusCode(500, "Error unsubscribing from push notifications");
        }
    }

    /// <summary>
    /// Send test notification (development/testing only)
    /// </summary>
    /// <returns>Success status</returns>
    [HttpPost("test")]
    public async Task<IActionResult> SendTestNotification()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId.Value, out var userIdGuid))
                return Unauthorized();

            var result = await _pushNotificationService.SendNotificationAsync(
                userIdGuid,
                "Test Notification",
                "This is a test push notification from Fundarbók");

            if (result)
                return Ok(new { message = "Test notification sent" });

            return BadRequest("Failed to send test notification");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending test notification");
            return StatusCode(500, "Error sending test notification");
        }
    }
}
