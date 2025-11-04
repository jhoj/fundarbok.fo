using Fundarbok.Application.DTOs.Conclusion;

namespace Fundarbok.Application.Services;

public interface IConclusionService
{
    Task<IEnumerable<ConclusionDto>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<ConclusionDto?> GetByIdAsync(Guid id);
    Task<ConclusionDto> CreateAsync(Guid agendaItemId, CreateConclusionRequest request);
    Task<ConclusionDto> UpdateAsync(Guid id, UpdateConclusionRequest request);
    Task<bool> DeleteAsync(Guid id);
}
