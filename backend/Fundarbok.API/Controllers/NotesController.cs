using Fundarbok.Application.DTOs.AgendaItem;
using Fundarbok.Application.DTOs.Note;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fundarbok.API.Controllers;

/// <summary>
/// Controller for managing personal notes on agenda items
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly INoteService _noteService;
    private readonly ILogger<NotesController> _logger;

    public NotesController(INoteService noteService, ILogger<NotesController> logger)
    {
        _noteService = noteService;
        _logger = logger;
    }

    /// <summary>
    /// Get all notes for an agenda item (user sees only their own notes)
    /// </summary>
    [HttpGet("agenda-item/{agendaItemId}")]
    [ProducesResponseType(typeof(IEnumerable<NoteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NoteDto>>> GetByAgendaItem(Guid agendaItemId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var notes = await _noteService.GetByAgendaItemIdAsync(agendaItemId);

            // Filter to only return current user's notes
            var userNotes = notes.Where(n => n.UserId == userId);
            return Ok(userNotes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving notes");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Get all notes for the current user
    /// </summary>
    [HttpGet("my")]
    [ProducesResponseType(typeof(IEnumerable<NoteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NoteDto>>> GetMyNotes()
    {
        try
        {
            var userId = GetCurrentUserId();
            var notes = await _noteService.GetByUserIdAsync(userId);
            return Ok(notes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user notes");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Create a new note
    /// </summary>
    [HttpPost("agenda-item/{agendaItemId}")]
    [ProducesResponseType(typeof(NoteDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<NoteDto>> Create(Guid agendaItemId, [FromBody] CreateNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "Note text is required" });
        }

        try
        {
            var userId = GetCurrentUserId();
            var created = await _noteService.CreateAsync(agendaItemId, userId, request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating note");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Get a specific note (user can only access their own notes)
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(NoteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<NoteDto>> GetById(Guid id)
    {
        try
        {
            var note = await _noteService.GetByIdAsync(id);
            if (note == null)
            {
                return NotFound(new { message = "Note not found" });
            }

            var userId = GetCurrentUserId();
            if (note.UserId != userId)
            {
                return Forbid();
            }

            return Ok(note);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving note");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Update a note (user can only update their own notes)
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(NoteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<NoteDto>> Update(Guid id, [FromBody] UpdateNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "Note text is required" });
        }

        try
        {
            var note = await _noteService.GetByIdAsync(id);
            if (note == null)
            {
                return NotFound(new { message = "Note not found" });
            }

            var userId = GetCurrentUserId();
            if (note.UserId != userId)
            {
                return Forbid();
            }

            var updated = await _noteService.UpdateAsync(id, request);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Note not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating note");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Delete a note (user can only delete their own notes)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var note = await _noteService.GetByIdAsync(id);
            if (note == null)
            {
                return NotFound(new { message = "Note not found" });
            }

            var userId = GetCurrentUserId();
            if (note.UserId != userId)
            {
                return Forbid();
            }

            await _noteService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting note");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user");
        }
        return userId;
    }
}
