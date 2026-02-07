using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<AgendaTask>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<IEnumerable<AgendaTask>> GetByUserIdAsync(Guid userId);
    Task<AgendaTask?> GetByIdAsync(Guid id);
    Task<AgendaTask> CreateAsync(AgendaTask task);
    Task<AgendaTask> UpdateAsync(AgendaTask task);
    Task<bool> DeleteAsync(Guid id);
}
