using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class ConclusionRepository : IConclusionRepository
{
    private readonly FundarbokDbContext _context;

    public ConclusionRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Conclusion>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        return await _context.Conclusions
            .Where(c => c.AgendaItemId == agendaItemId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Conclusion?> GetByIdAsync(Guid id)
    {
        return await _context.Conclusions
            .Include(c => c.AgendaItem)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Conclusion> CreateAsync(Conclusion conclusion)
    {
        conclusion.CreatedAt = DateTime.UtcNow;
        conclusion.UpdatedAt = DateTime.UtcNow;

        _context.Conclusions.Add(conclusion);
        await _context.SaveChangesAsync();

        return conclusion;
    }

    public async Task<Conclusion> UpdateAsync(Conclusion conclusion)
    {
        conclusion.UpdatedAt = DateTime.UtcNow;

        _context.Conclusions.Update(conclusion);
        await _context.SaveChangesAsync();

        return conclusion;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var conclusion = await _context.Conclusions.FindAsync(id);
        if (conclusion == null)
        {
            return false;
        }

        _context.Conclusions.Remove(conclusion);
        await _context.SaveChangesAsync();

        return true;
    }
}
