using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly FundarbokDbContext _context;

    public TaskRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AgendaTask>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        return await _context.AgendaTasks
            .Where(t => t.AgendaItemId == agendaItemId)
            .Include(t => t.AssignedUser)
            .OrderBy(t => t.IsCompleted)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<AgendaTask>> GetByUserIdAsync(Guid userId)
    {
        return await _context.AgendaTasks
            .Where(t => t.AssignedUserId == userId)
            .Include(t => t.AgendaItem)
                .ThenInclude(a => a.Meeting)
            .OrderBy(t => t.IsCompleted)
            .ThenBy(t => t.DueDate)
            .ToListAsync();
    }

    public async Task<AgendaTask?> GetByIdAsync(Guid id)
    {
        return await _context.AgendaTasks
            .Include(t => t.AssignedUser)
            .Include(t => t.AgendaItem)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<AgendaTask> CreateAsync(AgendaTask task)
    {
        task.CreatedAt = DateTime.UtcNow;
        task.UpdatedAt = DateTime.UtcNow;

        _context.AgendaTasks.Add(task);
        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<AgendaTask> UpdateAsync(AgendaTask task)
    {
        task.UpdatedAt = DateTime.UtcNow;

        _context.AgendaTasks.Update(task);
        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var task = await _context.AgendaTasks.FindAsync(id);
        if (task == null)
        {
            return false;
        }

        _context.AgendaTasks.Remove(task);
        await _context.SaveChangesAsync();

        return true;
    }
}
