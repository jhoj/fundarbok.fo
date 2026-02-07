using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface IRecommendationRepository
{
    Task<IEnumerable<Recommendation>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<Recommendation?> GetByIdAsync(Guid id);
    Task<Recommendation> CreateAsync(Recommendation recommendation);
    Task<Recommendation> UpdateAsync(Recommendation recommendation);
    Task<bool> DeleteAsync(Guid id);
}
