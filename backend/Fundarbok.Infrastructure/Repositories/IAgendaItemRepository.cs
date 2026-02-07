using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface IAgendaItemRepository
{
    Task<IEnumerable<AgendaItem>> GetByMeetingIdAsync(Guid meetingId);
    Task<AgendaItem?> GetByIdAsync(Guid id);
    Task<AgendaItem?> GetWithDetailsAsync(Guid id);
    Task<AgendaItem> CreateAsync(AgendaItem agendaItem);
    Task<AgendaItem> UpdateAsync(AgendaItem agendaItem);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ReorderAsync(Guid meetingId, List<Guid> orderedIds);
}
