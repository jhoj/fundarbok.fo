using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class PushSubscriptionRepository : IPushSubscriptionRepository
{
    private readonly FundarbokDbContext _context;

    public PushSubscriptionRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<PushSubscription?> GetByIdAsync(Guid id)
    {
        return await _context.PushSubscriptions
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<PushSubscription?> GetByUserIdAsync(Guid userId)
    {
        return await _context.PushSubscriptions
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task<PushSubscription> CreateAsync(PushSubscription subscription)
    {
        _context.PushSubscriptions.Add(subscription);
        await _context.SaveChangesAsync();
        return subscription;
    }

    public async Task<PushSubscription> UpdateAsync(PushSubscription subscription)
    {
        _context.PushSubscriptions.Update(subscription);
        await _context.SaveChangesAsync();
        return subscription;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var subscription = await GetByIdAsync(id);
        if (subscription == null)
            return false;

        _context.PushSubscriptions.Remove(subscription);
        await _context.SaveChangesAsync();
        return true;
    }
}
