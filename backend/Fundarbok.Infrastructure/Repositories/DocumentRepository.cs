using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class DocumentRepository : IDocumentRepository
{
    private readonly FundarbokDbContext _context;

    public DocumentRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Document>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        return await _context.Documents
            .Where(d => d.AgendaItemId == agendaItemId)
            .OrderBy(d => d.Number)
            .ToListAsync();
    }

    public async Task<IEnumerable<Document>> GetByMeetingIdAsync(Guid meetingId)
    {
        return await _context.Documents
            .Where(d => d.MeetingId == meetingId)
            .OrderBy(d => d.Number)
            .ToListAsync();
    }

    public async Task<Document?> GetByIdAsync(Guid id)
    {
        return await _context.Documents
            .Include(d => d.AgendaItem)
            .Include(d => d.Meeting)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Document> CreateAsync(Document document)
    {
        document.CreatedAt = DateTime.UtcNow;
        document.UpdatedAt = DateTime.UtcNow;

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();

        return document;
    }

    public async Task<Document> UpdateAsync(Document document)
    {
        document.UpdatedAt = DateTime.UtcNow;

        _context.Documents.Update(document);
        await _context.SaveChangesAsync();

        return document;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document == null)
        {
            return false;
        }

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();

        return true;
    }
}
