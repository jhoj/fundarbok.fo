using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface IDocumentRepository
{
    Task<IEnumerable<Document>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<IEnumerable<Document>> GetByMeetingIdAsync(Guid meetingId);
    Task<Document?> GetByIdAsync(Guid id);
    Task<Document> CreateAsync(Document document);
    Task<Document> UpdateAsync(Document document);
    Task<bool> DeleteAsync(Guid id);
}
