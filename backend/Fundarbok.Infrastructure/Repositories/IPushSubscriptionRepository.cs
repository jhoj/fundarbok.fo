using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface IPushSubscriptionRepository
{
    Task<PushSubscription?> GetByIdAsync(Guid id);
    Task<PushSubscription?> GetByUserIdAsync(Guid userId);
    Task<PushSubscription> CreateAsync(PushSubscription subscription);
    Task<PushSubscription> UpdateAsync(PushSubscription subscription);
    Task<bool> DeleteAsync(Guid id);
}
