using Fundarbok.Application.DTOs.Meeting;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundarbok.API.Controllers;

/// <summary>
/// Meeting management controller for handling meeting and participant operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeetingsController : ControllerBase
{
    private readonly IMeetingService _meetingService;
    private readonly ILogger<MeetingsController> _logger;

    public MeetingsController(IMeetingService meetingService, ILogger<MeetingsController> logger)
    {
        _meetingService = meetingService;
        _logger = logger;
    }

    /// <summary>
    /// Get all meetings
    /// </summary>
    /// <returns>List of all meetings</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MeetingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MeetingDto>>> GetAllMeetings()
    {
        try
        {
            var meetings = await _meetingService.GetAllMeetingsAsync();
            return Ok(meetings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all meetings");
            return StatusCode(500, new { message = "An error occurred while retrieving meetings" });
        }
    }

    /// <summary>
    /// Get a single meeting by ID
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <returns>Meeting details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(MeetingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MeetingDto>> GetMeetingById(Guid id)
    {
        try
        {
            var meeting = await _meetingService.GetMeetingByIdAsync(id);
            if (meeting == null)
            {
                return NotFound(new { message = $"Meeting with ID {id} not found" });
            }

            return Ok(meeting);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting meeting {MeetingId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the meeting" });
        }
    }

    /// <summary>
    /// Get a meeting with full details including agenda items
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <returns>Detailed meeting information</returns>
    [HttpGet("{id}/details")]
    [ProducesResponseType(typeof(MeetingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MeetingDetailDto>> GetMeetingWithDetails(Guid id)
    {
        try
        {
            var meeting = await _meetingService.GetMeetingWithDetailsAsync(id);
            if (meeting == null)
            {
                return NotFound(new { message = $"Meeting with ID {id} not found" });
            }

            return Ok(meeting);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting meeting details for {MeetingId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the meeting details" });
        }
    }

    /// <summary>
    /// Get all meetings for a specific committee
    /// </summary>
    /// <param name="committeeId">Committee ID</param>
    /// <returns>List of meetings for the committee</returns>
    [HttpGet("committee/{committeeId}")]
    [ProducesResponseType(typeof(IEnumerable<MeetingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MeetingDto>>> GetMeetingsByCommitteeId(Guid committeeId)
    {
        try
        {
            var meetings = await _meetingService.GetMeetingsByCommitteeIdAsync(committeeId);
            return Ok(meetings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting meetings for committee {CommitteeId}", committeeId);
            return StatusCode(500, new { message = "An error occurred while retrieving committee meetings" });
        }
    }

    /// <summary>
    /// Create a new meeting (Secretary only)
    /// </summary>
    /// <param name="request">Meeting creation details</param>
    /// <returns>Created meeting</returns>
    [HttpPost]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(MeetingDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MeetingDto>> CreateMeeting([FromBody] CreateMeetingRequest request)
    {
        try
        {
            var meeting = await _meetingService.CreateMeetingAsync(request);
            return CreatedAtAction(nameof(GetMeetingById), new { id = meeting.Id }, meeting);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating meeting");
            return StatusCode(500, new { message = "An error occurred while creating the meeting" });
        }
    }

    /// <summary>
    /// Update an existing meeting (Secretary only)
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <param name="request">Updated meeting details</param>
    /// <returns>Updated meeting</returns>
    [HttpPut("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(MeetingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MeetingDto>> UpdateMeeting(Guid id, [FromBody] UpdateMeetingRequest request)
    {
        try
        {
            var meeting = await _meetingService.UpdateMeetingAsync(id, request);
            if (meeting == null)
            {
                return NotFound(new { message = $"Meeting with ID {id} not found" });
            }

            return Ok(meeting);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating meeting {MeetingId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the meeting" });
        }
    }

    /// <summary>
    /// Delete a meeting (Secretary only)
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteMeeting(Guid id)
    {
        try
        {
            var result = await _meetingService.DeleteMeetingAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Meeting with ID {id} not found" });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting meeting {MeetingId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the meeting" });
        }
    }

    /// <summary>
    /// Update meeting status (Secretary only)
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <param name="request">Status update details</param>
    /// <returns>Updated meeting</returns>
    [HttpPatch("{id}/status")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(MeetingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MeetingDto>> UpdateMeetingStatus(Guid id, [FromBody] UpdateMeetingStatusRequest request)
    {
        try
        {
            var meeting = await _meetingService.UpdateMeetingStatusAsync(id, request);
            if (meeting == null)
            {
                return NotFound(new { message = $"Meeting with ID {id} not found" });
            }

            return Ok(meeting);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating meeting status for {MeetingId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the meeting status" });
        }
    }

    /// <summary>
    /// Get all participants of a meeting
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <returns>List of meeting participants</returns>
    [HttpGet("{id}/participants")]
    [ProducesResponseType(typeof(IEnumerable<MeetingParticipantDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MeetingParticipantDto>>> GetMeetingParticipants(Guid id)
    {
        try
        {
            var participants = await _meetingService.GetMeetingParticipantsAsync(id);
            return Ok(participants);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting participants for meeting {MeetingId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving meeting participants" });
        }
    }

    /// <summary>
    /// Add a participant to a meeting (Secretary only)
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <param name="request">Participant details</param>
    /// <returns>Created participant</returns>
    [HttpPost("{id}/participants")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(MeetingParticipantDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MeetingParticipantDto>> AddParticipant(Guid id, [FromBody] AddParticipantRequest request)
    {
        try
        {
            var participant = await _meetingService.AddParticipantAsync(id, request);
            return CreatedAtAction(nameof(GetMeetingParticipants), new { id }, participant);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding participant to meeting {MeetingId}", id);
            return StatusCode(500, new { message = "An error occurred while adding the participant" });
        }
    }

    /// <summary>
    /// Remove a participant from a meeting (Secretary only)
    /// </summary>
    /// <param name="id">Meeting ID</param>
    /// <param name="participantId">Participant ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}/participants/{participantId}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveParticipant(Guid id, Guid participantId)
    {
        try
        {
            var result = await _meetingService.RemoveParticipantAsync(id, participantId);
            if (!result)
            {
                return NotFound(new { message = $"Participant with ID {participantId} not found in meeting {id}" });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing participant {ParticipantId} from meeting {MeetingId}", participantId, id);
            return StatusCode(500, new { message = "An error occurred while removing the participant" });
        }
    }
}
