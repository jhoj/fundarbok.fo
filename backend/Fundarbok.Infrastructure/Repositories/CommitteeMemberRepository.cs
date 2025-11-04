using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class CommitteeMemberRepository : ICommitteeMemberRepository
{
    private readonly FundarbokDbContext _context;

    public CommitteeMemberRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<CommitteeMember?> GetByIdAsync(Guid id)
    {
        return await _context.CommitteeMembers
            .Include(m => m.Committee)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<CommitteeMember> CreateAsync(CommitteeMember member)
    {
        _context.CommitteeMembers.Add(member);
        await _context.SaveChangesAsync();
        return member;
    }

    public async Task<CommitteeMember> UpdateAsync(CommitteeMember member)
    {
        _context.CommitteeMembers.Update(member);
        await _context.SaveChangesAsync();
        return member;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var member = await _context.CommitteeMembers.FindAsync(id);
        if (member == null)
        {
            return false;
        }

        _context.CommitteeMembers.Remove(member);
        await _context.SaveChangesAsync();
        return true;
    }
}
