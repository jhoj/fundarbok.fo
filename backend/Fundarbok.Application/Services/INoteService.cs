using Fundarbok.Application.DTOs.Note;
using NoteDto = Fundarbok.Application.DTOs.Note.NoteDto;

namespace Fundarbok.Application.Services;

public interface INoteService
{
    Task<IEnumerable<NoteDto>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<IEnumerable<NoteDto>> GetByUserIdAsync(Guid userId);
    Task<NoteDto?> GetByIdAsync(Guid id);
    Task<NoteDto> CreateAsync(Guid agendaItemId, Guid userId, CreateNoteRequest request);
    Task<NoteDto> UpdateAsync(Guid id, UpdateNoteRequest request);
    Task<bool> DeleteAsync(Guid id);
}
