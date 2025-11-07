using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly FundarbokDbContext _context;

    public UserRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.PushSubscriptions)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByCommitteeMemberIdAsync(Guid committeeMemberId)
    {
        return await _context.Users
            .Include(u => u.PushSubscriptions)
            .FirstOrDefaultAsync(u => u.CommitteeMemberId == committeeMemberId);
    }

    public async Task<List<User>> GetByCommitteeMemberIdsAsync(List<Guid> committeeMemberIds)
    {
        return await _context.Users
            .Where(u => u.CommitteeMemberId != null && committeeMemberIds.Contains(u.CommitteeMemberId.Value))
            .Include(u => u.PushSubscriptions)
            .ToListAsync();
    }
}
