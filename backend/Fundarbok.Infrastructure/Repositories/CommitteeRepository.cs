using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class CommitteeRepository : ICommitteeRepository
{
    private readonly FundarbokDbContext _context;

    public CommitteeRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Committee>> GetAllAsync()
    {
        return await _context.Committees
            .Include(c => c.CommitteeMembers)
            .Include(c => c.Meetings)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Committee?> GetByIdAsync(Guid id)
    {
        return await _context.Committees
            .Include(c => c.CommitteeMembers)
            .Include(c => c.Meetings)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Committee> CreateAsync(Committee committee)
    {
        _context.Committees.Add(committee);
        await _context.SaveChangesAsync();
        return committee;
    }

    public async Task<Committee> UpdateAsync(Committee committee)
    {
        _context.Committees.Update(committee);
        await _context.SaveChangesAsync();
        return committee;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var committee = await _context.Committees.FindAsync(id);
        if (committee == null)
        {
            return false;
        }

        _context.Committees.Remove(committee);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<CommitteeMember>> GetMembersAsync(Guid committeeId)
    {
        return await _context.CommitteeMembers
            .Include(m => m.Alternate)
            .Where(m => m.CommitteeId == committeeId)
            .OrderBy(m => m.Name)
            .ToListAsync();
    }
}
