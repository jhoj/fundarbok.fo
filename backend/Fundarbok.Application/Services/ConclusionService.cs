using Fundarbok.Application.DTOs.Conclusion;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;

namespace Fundarbok.Application.Services;

public class ConclusionService : IConclusionService
{
    private readonly IConclusionRepository _repository;

    public ConclusionService(IConclusionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ConclusionDto>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        var conclusions = await _repository.GetByAgendaItemIdAsync(agendaItemId);
        return conclusions.Select(MapToDto);
    }

    public async Task<ConclusionDto?> GetByIdAsync(Guid id)
    {
        var conclusion = await _repository.GetByIdAsync(id);
        return conclusion != null ? MapToDto(conclusion) : null;
    }

    public async Task<ConclusionDto> CreateAsync(Guid agendaItemId, CreateConclusionRequest request)
    {
        var conclusion = new Conclusion
        {
            Id = Guid.NewGuid(),
            AgendaItemId = agendaItemId,
            Text = request.Text
        };

        var created = await _repository.CreateAsync(conclusion);
        return MapToDto(created);
    }

    public async Task<ConclusionDto> UpdateAsync(Guid id, UpdateConclusionRequest request)
    {
        var conclusion = await _repository.GetByIdAsync(id);
        if (conclusion == null)
        {
            throw new KeyNotFoundException($"Conclusion with ID {id} not found");
        }

        conclusion.Text = request.Text;

        var updated = await _repository.UpdateAsync(conclusion);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static ConclusionDto MapToDto(Conclusion conclusion)
    {
        return new ConclusionDto
        {
            Id = conclusion.Id,
            AgendaItemId = conclusion.AgendaItemId,
            Text = conclusion.Text,
            CreatedAt = conclusion.CreatedAt,
            UpdatedAt = conclusion.UpdatedAt
        };
    }
}
