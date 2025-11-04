using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class RecommendationRepository : IRecommendationRepository
{
    private readonly FundarbokDbContext _context;

    public RecommendationRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Recommendation>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        return await _context.Recommendations
            .Where(r => r.AgendaItemId == agendaItemId)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Recommendation?> GetByIdAsync(Guid id)
    {
        return await _context.Recommendations
            .Include(r => r.AgendaItem)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Recommendation> CreateAsync(Recommendation recommendation)
    {
        recommendation.CreatedAt = DateTime.UtcNow;
        recommendation.UpdatedAt = DateTime.UtcNow;

        _context.Recommendations.Add(recommendation);
        await _context.SaveChangesAsync();

        return recommendation;
    }

    public async Task<Recommendation> UpdateAsync(Recommendation recommendation)
    {
        recommendation.UpdatedAt = DateTime.UtcNow;

        _context.Recommendations.Update(recommendation);
        await _context.SaveChangesAsync();

        return recommendation;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var recommendation = await _context.Recommendations.FindAsync(id);
        if (recommendation == null)
        {
            return false;
        }

        _context.Recommendations.Remove(recommendation);
        await _context.SaveChangesAsync();

        return true;
    }
}
