using Fundarbok.Application.DTOs.Note;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;
using NoteDto = Fundarbok.Application.DTOs.Note.NoteDto;

namespace Fundarbok.Application.Services;

public class NoteService : INoteService
{
    private readonly INoteRepository _repository;

    public NoteService(INoteRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<NoteDto>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        var notes = await _repository.GetByAgendaItemIdAsync(agendaItemId);
        return notes.Select(MapToDto);
    }

    public async Task<IEnumerable<NoteDto>> GetByUserIdAsync(Guid userId)
    {
        var notes = await _repository.GetByUserIdAsync(userId);
        return notes.Select(MapToDto);
    }

    public async Task<NoteDto?> GetByIdAsync(Guid id)
    {
        var note = await _repository.GetByIdAsync(id);
        return note != null ? MapToDto(note) : null;
    }

    public async Task<NoteDto> CreateAsync(Guid agendaItemId, Guid userId, CreateNoteRequest request)
    {
        var note = new Note
        {
            Id = Guid.NewGuid(),
            AgendaItemId = agendaItemId,
            UserId = userId,
            Text = request.Text
        };

        var created = await _repository.CreateAsync(note);
        return MapToDto(created);
    }

    public async Task<NoteDto> UpdateAsync(Guid id, UpdateNoteRequest request)
    {
        var note = await _repository.GetByIdAsync(id);
        if (note == null)
        {
            throw new KeyNotFoundException($"Note with ID {id} not found");
        }

        note.Text = request.Text;

        var updated = await _repository.UpdateAsync(note);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static NoteDto MapToDto(Note note)
    {
        return new NoteDto
        {
            Id = note.Id,
            AgendaItemId = note.AgendaItemId,
            UserId = note.UserId,
            UserName = note.User?.Name ?? string.Empty,
            Text = note.Text,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt
        };
    }
}
