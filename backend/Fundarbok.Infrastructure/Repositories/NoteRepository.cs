using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class NoteRepository : INoteRepository
{
    private readonly FundarbokDbContext _context;

    public NoteRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Note>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        return await _context.Notes
            .Where(n => n.AgendaItemId == agendaItemId)
            .Include(n => n.User)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Note>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Notes
            .Where(n => n.UserId == userId)
            .Include(n => n.AgendaItem)
                .ThenInclude(a => a.Meeting)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Note?> GetByIdAsync(Guid id)
    {
        return await _context.Notes
            .Include(n => n.User)
            .Include(n => n.AgendaItem)
            .FirstOrDefaultAsync(n => n.Id == id);
    }

    public async Task<Note> CreateAsync(Note note)
    {
        note.CreatedAt = DateTime.UtcNow;
        note.UpdatedAt = DateTime.UtcNow;

        _context.Notes.Add(note);
        await _context.SaveChangesAsync();

        return note;
    }

    public async Task<Note> UpdateAsync(Note note)
    {
        note.UpdatedAt = DateTime.UtcNow;

        _context.Notes.Update(note);
        await _context.SaveChangesAsync();

        return note;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
        {
            return false;
        }

        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();

        return true;
    }
}
