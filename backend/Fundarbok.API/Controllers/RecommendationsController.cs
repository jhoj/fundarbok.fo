using Fundarbok.Application.DTOs.Recommendation;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundarbok.API.Controllers;

/// <summary>
/// Controller for managing recommendations on agenda items
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecommendationsController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;
    private readonly ILogger<RecommendationsController> _logger;

    public RecommendationsController(IRecommendationService recommendationService, ILogger<RecommendationsController> logger)
    {
        _recommendationService = recommendationService;
        _logger = logger;
    }

    /// <summary>
    /// Get all recommendations for an agenda item
    /// </summary>
    [HttpGet("agenda-item/{agendaItemId}")]
    [ProducesResponseType(typeof(IEnumerable<RecommendationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetByAgendaItem(Guid agendaItemId)
    {
        try
        {
            var recommendations = await _recommendationService.GetByAgendaItemIdAsync(agendaItemId);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving recommendations");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Get a specific recommendation
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RecommendationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RecommendationDto>> GetById(Guid id)
    {
        try
        {
            var recommendation = await _recommendationService.GetByIdAsync(id);
            if (recommendation == null)
            {
                return NotFound(new { message = "Recommendation not found" });
            }

            return Ok(recommendation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving recommendation");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Create a new recommendation (Secretary only)
    /// </summary>
    [HttpPost("agenda-item/{agendaItemId}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(RecommendationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RecommendationDto>> Create(Guid agendaItemId, [FromBody] CreateRecommendationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "Recommendation text is required" });
        }

        try
        {
            var created = await _recommendationService.CreateAsync(agendaItemId, request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating recommendation");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Update a recommendation (Secretary only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(RecommendationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RecommendationDto>> Update(Guid id, [FromBody] UpdateRecommendationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "Recommendation text is required" });
        }

        try
        {
            var updated = await _recommendationService.UpdateAsync(id, request);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Recommendation not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating recommendation");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    /// <summary>
    /// Delete a recommendation (Secretary only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var result = await _recommendationService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Recommendation not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting recommendation");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }
}
