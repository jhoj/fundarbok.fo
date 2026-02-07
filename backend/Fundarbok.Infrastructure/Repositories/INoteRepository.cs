using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface INoteRepository
{
    Task<IEnumerable<Note>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<IEnumerable<Note>> GetByUserIdAsync(Guid userId);
    Task<Note?> GetByIdAsync(Guid id);
    Task<Note> CreateAsync(Note note);
    Task<Note> UpdateAsync(Note note);
    Task<bool> DeleteAsync(Guid id);
}
