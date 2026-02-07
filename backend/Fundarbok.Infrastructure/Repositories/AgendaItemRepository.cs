using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class AgendaItemRepository : IAgendaItemRepository
{
    private readonly FundarbokDbContext _context;

    public AgendaItemRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AgendaItem>> GetByMeetingIdAsync(Guid meetingId)
    {
        return await _context.AgendaItems
            .Where(a => a.MeetingId == meetingId)
            .OrderBy(a => a.Number)
            .Include(a => a.Documents)
            .Include(a => a.Recommendations)
            .Include(a => a.Conclusions)
            .Include(a => a.Notes)
            .Include(a => a.Tasks)
            .ToListAsync();
    }

    public async Task<AgendaItem?> GetByIdAsync(Guid id)
    {
        return await _context.AgendaItems
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<AgendaItem?> GetWithDetailsAsync(Guid id)
    {
        return await _context.AgendaItems
            .Include(a => a.Meeting)
            .Include(a => a.Documents)
            .Include(a => a.Recommendations)
            .Include(a => a.Conclusions)
            .Include(a => a.Notes)
                .ThenInclude(n => n.User)
            .Include(a => a.Tasks)
                .ThenInclude(t => t.AssignedUser)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<AgendaItem> CreateAsync(AgendaItem agendaItem)
    {
        agendaItem.CreatedAt = DateTime.UtcNow;
        agendaItem.UpdatedAt = DateTime.UtcNow;

        _context.AgendaItems.Add(agendaItem);
        await _context.SaveChangesAsync();

        return agendaItem;
    }

    public async Task<AgendaItem> UpdateAsync(AgendaItem agendaItem)
    {
        agendaItem.UpdatedAt = DateTime.UtcNow;

        _context.AgendaItems.Update(agendaItem);
        await _context.SaveChangesAsync();

        return agendaItem;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var agendaItem = await _context.AgendaItems.FindAsync(id);
        if (agendaItem == null)
        {
            return false;
        }

        _context.AgendaItems.Remove(agendaItem);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ReorderAsync(Guid meetingId, List<Guid> orderedIds)
    {
        var agendaItems = await _context.AgendaItems
            .Where(a => a.MeetingId == meetingId && orderedIds.Contains(a.Id))
            .ToListAsync();

        if (agendaItems.Count != orderedIds.Count)
        {
            return false;
        }

        for (int i = 0; i < orderedIds.Count; i++)
        {
            var item = agendaItems.First(a => a.Id == orderedIds[i]);
            item.Number = i + 1;
            item.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
