using Fundarbok.Application.DTOs.Recommendation;

namespace Fundarbok.Application.Services;

public interface IRecommendationService
{
    Task<IEnumerable<RecommendationDto>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<RecommendationDto?> GetByIdAsync(Guid id);
    Task<RecommendationDto> CreateAsync(Guid agendaItemId, CreateRecommendationRequest request);
    Task<RecommendationDto> UpdateAsync(Guid id, UpdateRecommendationRequest request);
    Task<bool> DeleteAsync(Guid id);
}
