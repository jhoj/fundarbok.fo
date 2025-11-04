using Fundarbok.Application.DTOs.Conclusion;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundarbok.API.Controllers;

/// <summary>
/// Controller for managing conclusions on agenda items
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConclusionsController : ControllerBase
{
    private readonly IConclusionService _conclusionService;
    private readonly ILogger<ConclusionsController> _logger;

    public ConclusionsController(IConclusionService conclusionService, ILogger<ConclusionsController> logger)
    {
        _conclusionService = conclusionService;
        _logger = logger;
    }

    /// <summary>
    /// Get all conclusions for an agenda item
    /// </summary>
    [HttpGet("agenda-item/{agendaItemId}")]
    [ProducesResponseType(typeof(IEnumerable<ConclusionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ConclusionDto>>> GetByAgendaItem(Guid agendaItemId)
    {
        try
        {
            var conclusions = await _conclusionService.GetByAgendaItemIdAsync(agendaItemId);
            return Ok(conclusions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving conclusions");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Get a specific conclusion
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ConclusionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ConclusionDto>> GetById(Guid id)
    {
        try
        {
            var conclusion = await _conclusionService.GetByIdAsync(id);
            if (conclusion == null)
            {
                return NotFound(new { message = "Conclusion not found" });
            }

            return Ok(conclusion);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving conclusion");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Create a new conclusion (Secretary only)
    /// </summary>
    [HttpPost("agenda-item/{agendaItemId}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(ConclusionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ConclusionDto>> Create(Guid agendaItemId, [FromBody] CreateConclusionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "Conclusion text is required" });
        }

        try
        {
            var created = await _conclusionService.CreateAsync(agendaItemId, request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating conclusion");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Update a conclusion (Secretary only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(ConclusionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ConclusionDto>> Update(Guid id, [FromBody] UpdateConclusionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "Conclusion text is required" });
        }

        try
        {
            var updated = await _conclusionService.UpdateAsync(id, request);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Conclusion not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating conclusion");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Delete a conclusion (Secretary only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var result = await _conclusionService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Conclusion not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting conclusion");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}
