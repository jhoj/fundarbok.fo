using Fundarbok.Application.DTOs.AgendaItem;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundarbok.API.Controllers;

/// <summary>
/// Controller for managing agenda items within meetings
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgendaItemsController : ControllerBase
{
    private readonly IAgendaItemService _agendaItemService;
    private readonly ILogger<AgendaItemsController> _logger;

    public AgendaItemsController(
        IAgendaItemService agendaItemService,
        ILogger<AgendaItemsController> logger)
    {
        _agendaItemService = agendaItemService;
        _logger = logger;
    }

    /// <summary>
    /// Get all agenda items for a specific meeting
    /// </summary>
    /// <param name="meetingId">Meeting ID</param>
    /// <returns>List of agenda items</returns>
    [HttpGet("meeting/{meetingId}")]
    [ProducesResponseType(typeof(IEnumerable<AgendaItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AgendaItemDto>>> GetByMeeting(Guid meetingId)
    {
        try
        {
            var items = await _agendaItemService.GetByMeetingIdAsync(meetingId);
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving agenda items for meeting {MeetingId}", meetingId);
            return StatusCode(500, new { message = "An error occurred while retrieving agenda items" });
        }
    }

    /// <summary>
    /// Get a single agenda item with full details
    /// </summary>
    /// <param name="id">Agenda item ID</param>
    /// <returns>Detailed agenda item information</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AgendaItemDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgendaItemDetailDto>> GetById(Guid id)
    {
        try
        {
            var item = await _agendaItemService.GetByIdAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Agenda item not found" });
            }

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving agenda item {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the agenda item" });
        }
    }

    /// <summary>
    /// Create a new agenda item for a meeting (Secretary only)
    /// </summary>
    /// <param name="meetingId">Meeting ID</param>
    /// <param name="request">Agenda item details</param>
    /// <returns>Created agenda item</returns>
    [HttpPost("meeting/{meetingId}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(AgendaItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgendaItemDto>> Create(Guid meetingId, [FromBody] CreateAgendaItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { message = "Title is required" });
        }

        try
        {
            var created = await _agendaItemService.CreateAsync(meetingId, request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating agenda item for meeting {MeetingId}", meetingId);
            return StatusCode(500, new { message = "An error occurred while creating the agenda item" });
        }
    }

    /// <summary>
    /// Update an existing agenda item (Secretary only)
    /// </summary>
    /// <param name="id">Agenda item ID</param>
    /// <param name="request">Updated agenda item details</param>
    /// <returns>Updated agenda item</returns>
    [HttpPut("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(AgendaItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgendaItemDto>> Update(Guid id, [FromBody] UpdateAgendaItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { message = "Title is required" });
        }

        try
        {
            var updated = await _agendaItemService.UpdateAsync(id, request);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Agenda item not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating agenda item {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the agenda item" });
        }
    }

    /// <summary>
    /// Delete an agenda item (Secretary only)
    /// </summary>
    /// <param name="id">Agenda item ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var result = await _agendaItemService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new { message = "Agenda item not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting agenda item {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the agenda item" });
        }
    }

    /// <summary>
    /// Reorder agenda items within a meeting (Secretary only)
    /// </summary>
    /// <param name="meetingId">Meeting ID</param>
    /// <param name="request">New order of agenda item IDs</param>
    /// <returns>Success status</returns>
    [HttpPost("meeting/{meetingId}/reorder")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Reorder(Guid meetingId, [FromBody] ReorderAgendaItemsRequest request)
    {
        if (request.OrderedIds == null || !request.OrderedIds.Any())
        {
            return BadRequest(new { message = "OrderedIds are required" });
        }

        try
        {
            var result = await _agendaItemService.ReorderAsync(meetingId, request);

            if (!result)
            {
                return BadRequest(new { message = "Failed to reorder agenda items" });
            }

            return Ok(new { message = "Agenda items reordered successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reordering agenda items for meeting {MeetingId}", meetingId);
            return StatusCode(500, new { message = "An error occurred while reordering agenda items" });
        }
    }
}
