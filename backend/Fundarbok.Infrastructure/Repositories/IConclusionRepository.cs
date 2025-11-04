using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface IConclusionRepository
{
    Task<IEnumerable<Conclusion>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<Conclusion?> GetByIdAsync(Guid id);
    Task<Conclusion> CreateAsync(Conclusion conclusion);
    Task<Conclusion> UpdateAsync(Conclusion conclusion);
    Task<bool> DeleteAsync(Guid id);
}
