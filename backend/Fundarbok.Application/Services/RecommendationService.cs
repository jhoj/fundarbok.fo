using Fundarbok.Application.DTOs.Recommendation;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;

namespace Fundarbok.Application.Services;

public class RecommendationService : IRecommendationService
{
    private readonly IRecommendationRepository _repository;

    public RecommendationService(IRecommendationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<RecommendationDto>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        var recommendations = await _repository.GetByAgendaItemIdAsync(agendaItemId);
        return recommendations.Select(MapToDto);
    }

    public async Task<RecommendationDto?> GetByIdAsync(Guid id)
    {
        var recommendation = await _repository.GetByIdAsync(id);
        return recommendation != null ? MapToDto(recommendation) : null;
    }

    public async Task<RecommendationDto> CreateAsync(Guid agendaItemId, CreateRecommendationRequest request)
    {
        var recommendation = new Recommendation
        {
            Id = Guid.NewGuid(),
            AgendaItemId = agendaItemId,
            Text = request.Text
        };

        var created = await _repository.CreateAsync(recommendation);
        return MapToDto(created);
    }

    public async Task<RecommendationDto> UpdateAsync(Guid id, UpdateRecommendationRequest request)
    {
        var recommendation = await _repository.GetByIdAsync(id);
        if (recommendation == null)
        {
            throw new KeyNotFoundException($"Recommendation with ID {id} not found");
        }

        recommendation.Text = request.Text;

        var updated = await _repository.UpdateAsync(recommendation);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static RecommendationDto MapToDto(Recommendation recommendation)
    {
        return new RecommendationDto
        {
            Id = recommendation.Id,
            AgendaItemId = recommendation.AgendaItemId,
            Text = recommendation.Text,
            CreatedAt = recommendation.CreatedAt,
            UpdatedAt = recommendation.UpdatedAt
        };
    }
}
