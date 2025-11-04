using Fundarbok.Application.DTOs.AgendaItem;

namespace Fundarbok.Application.Services;

public interface IAgendaItemService
{
    Task<IEnumerable<AgendaItemDto>> GetByMeetingIdAsync(Guid meetingId);
    Task<AgendaItemDetailDto?> GetByIdAsync(Guid id);
    Task<AgendaItemDto> CreateAsync(Guid meetingId, CreateAgendaItemRequest request);
    Task<AgendaItemDto> UpdateAsync(Guid id, UpdateAgendaItemRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ReorderAsync(Guid meetingId, ReorderAgendaItemsRequest request);
}
