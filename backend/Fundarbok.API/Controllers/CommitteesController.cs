using Fundarbok.Application.DTOs.Committee;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundarbok.API.Controllers;

/// <summary>
/// Committee management controller for handling committee and committee member operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommitteesController : ControllerBase
{
    private readonly ICommitteeService _committeeService;
    private readonly ILogger<CommitteesController> _logger;

    public CommitteesController(ICommitteeService committeeService, ILogger<CommitteesController> logger)
    {
        _committeeService = committeeService;
        _logger = logger;
    }

    /// <summary>
    /// Get all committees
    /// </summary>
    /// <returns>List of all committees</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CommitteeDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CommitteeDto>>> GetAllCommittees()
    {
        try
        {
            var committees = await _committeeService.GetAllCommitteesAsync();
            return Ok(committees);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all committees");
            return StatusCode(500, new { message = "An error occurred while retrieving committees" });
        }
    }

    /// <summary>
    /// Get a single committee by ID
    /// </summary>
    /// <param name="id">Committee ID</param>
    /// <returns>Committee details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CommitteeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CommitteeDto>> GetCommitteeById(Guid id)
    {
        try
        {
            var committee = await _committeeService.GetCommitteeByIdAsync(id);
            if (committee == null)
            {
                return NotFound(new { message = $"Committee with ID {id} not found" });
            }

            return Ok(committee);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting committee {CommitteeId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the committee" });
        }
    }

    /// <summary>
    /// Create a new committee (Secretary only)
    /// </summary>
    /// <param name="request">Committee creation details</param>
    /// <returns>Created committee</returns>
    [HttpPost]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(CommitteeDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CommitteeDto>> CreateCommittee([FromBody] CreateCommitteeRequest request)
    {
        try
        {
            var committee = await _committeeService.CreateCommitteeAsync(request);
            return CreatedAtAction(nameof(GetCommitteeById), new { id = committee.Id }, committee);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating committee");
            return StatusCode(500, new { message = "An error occurred while creating the committee" });
        }
    }

    /// <summary>
    /// Update an existing committee (Secretary only)
    /// </summary>
    /// <param name="id">Committee ID</param>
    /// <param name="request">Updated committee details</param>
    /// <returns>Updated committee</returns>
    [HttpPut("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(CommitteeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CommitteeDto>> UpdateCommittee(Guid id, [FromBody] UpdateCommitteeRequest request)
    {
        try
        {
            var committee = await _committeeService.UpdateCommitteeAsync(id, request);
            if (committee == null)
            {
                return NotFound(new { message = $"Committee with ID {id} not found" });
            }

            return Ok(committee);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating committee {CommitteeId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the committee" });
        }
    }

    /// <summary>
    /// Delete a committee (Secretary only)
    /// </summary>
    /// <param name="id">Committee ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteCommittee(Guid id)
    {
        try
        {
            var result = await _committeeService.DeleteCommitteeAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Committee with ID {id} not found" });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting committee {CommitteeId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the committee" });
        }
    }

    /// <summary>
    /// Get all members of a committee
    /// </summary>
    /// <param name="id">Committee ID</param>
    /// <returns>List of committee members</returns>
    [HttpGet("{id}/members")]
    [ProducesResponseType(typeof(IEnumerable<CommitteeMemberDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CommitteeMemberDto>>> GetCommitteeMembers(Guid id)
    {
        try
        {
            var members = await _committeeService.GetCommitteeMembersAsync(id);
            return Ok(members);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting committee members for {CommitteeId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving committee members" });
        }
    }

    /// <summary>
    /// Add a new member to a committee (Secretary only)
    /// </summary>
    /// <param name="id">Committee ID</param>
    /// <param name="request">Member creation details</param>
    /// <returns>Created committee member</returns>
    [HttpPost("{id}/members")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(CommitteeMemberDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CommitteeMemberDto>> AddCommitteeMember(Guid id, [FromBody] CreateCommitteeMemberRequest request)
    {
        try
        {
            var member = await _committeeService.AddCommitteeMemberAsync(id, request);
            return CreatedAtAction(nameof(GetCommitteeMembers), new { id }, member);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding member to committee {CommitteeId}", id);
            return StatusCode(500, new { message = "An error occurred while adding the committee member" });
        }
    }

    /// <summary>
    /// Update a committee member (Secretary only)
    /// </summary>
    /// <param name="id">Committee ID</param>
    /// <param name="memberId">Member ID</param>
    /// <param name="request">Updated member details</param>
    /// <returns>Updated committee member</returns>
    [HttpPut("{id}/members/{memberId}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(CommitteeMemberDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CommitteeMemberDto>> UpdateCommitteeMember(Guid id, Guid memberId, [FromBody] UpdateCommitteeMemberRequest request)
    {
        try
        {
            var member = await _committeeService.UpdateCommitteeMemberAsync(id, memberId, request);
            if (member == null)
            {
                return NotFound(new { message = $"Committee member with ID {memberId} not found in committee {id}" });
            }

            return Ok(member);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating committee member {MemberId} in committee {CommitteeId}", memberId, id);
            return StatusCode(500, new { message = "An error occurred while updating the committee member" });
        }
    }

    /// <summary>
    /// Remove a member from a committee (Secretary only)
    /// </summary>
    /// <param name="id">Committee ID</param>
    /// <param name="memberId">Member ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}/members/{memberId}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCommitteeMember(Guid id, Guid memberId)
    {
        try
        {
            var result = await _committeeService.DeleteCommitteeMemberAsync(id, memberId);
            if (!result)
            {
                return NotFound(new { message = $"Committee member with ID {memberId} not found in committee {id}" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting committee member {MemberId} from committee {CommitteeId}", memberId, id);
            return StatusCode(500, new { message = "An error occurred while deleting the committee member" });
        }
    }
}
