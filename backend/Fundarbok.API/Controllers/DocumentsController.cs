using Fundarbok.Application.DTOs.Document;
using Fundarbok.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundarbok.API.Controllers;

public class UploadDocumentForm
{
    public IFormFile File { get; set; } = null!;
    public Guid? AgendaItemId { get; set; }
    public Guid? MeetingId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Number { get; set; } = 1;
    public bool IsPublic { get; set; } = true;
    public bool IsLocked { get; set; } = false;
}

/// <summary>
/// Controller for managing document uploads and downloads
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;
    private readonly ILogger<DocumentsController> _logger;

    public DocumentsController(
        IDocumentService documentService,
        ILogger<DocumentsController> logger)
    {
        _documentService = documentService;
        _logger = logger;
    }

    /// <summary>
    /// Get all documents for a specific agenda item
    /// </summary>
    /// <param name="agendaItemId">Agenda item ID</param>
    /// <returns>List of documents</returns>
    [HttpGet("agenda-item/{agendaItemId}")]
    [ProducesResponseType(typeof(IEnumerable<DocumentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetByAgendaItem(Guid agendaItemId)
    {
        try
        {
            var documents = await _documentService.GetByAgendaItemIdAsync(agendaItemId);
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving documents for agenda item {AgendaItemId}", agendaItemId);
            return StatusCode(500, new { message = "An error occurred while retrieving documents" });
        }
    }

    /// <summary>
    /// Get all documents for a specific meeting
    /// </summary>
    /// <param name="meetingId">Meeting ID</param>
    /// <returns>List of documents</returns>
    [HttpGet("meeting/{meetingId}")]
    [ProducesResponseType(typeof(IEnumerable<DocumentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetByMeeting(Guid meetingId)
    {
        try
        {
            var documents = await _documentService.GetByMeetingIdAsync(meetingId);
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving documents for meeting {MeetingId}", meetingId);
            return StatusCode(500, new { message = "An error occurred while retrieving documents" });
        }
    }

    /// <summary>
    /// Get a single document's metadata
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>Document metadata</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDto>> GetById(Guid id)
    {
        try
        {
            var document = await _documentService.GetByIdAsync(id);

            if (document == null)
            {
                return NotFound(new { message = "Document not found" });
            }

            return Ok(document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving document {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the document" });
        }
    }

    /// <summary>
    /// Upload a new document (Secretary only)
    /// </summary>
    /// <param name="file">File to upload</param>
    /// <param name="agendaItemId">Optional agenda item ID</param>
    /// <param name="meetingId">Optional meeting ID</param>
    /// <param name="name">Document name</param>
    /// <param name="description">Document description</param>
    /// <param name="number">Document number</param>
    /// <param name="isPublic">Is document public</param>
    /// <param name="isLocked">Is document locked</param>
    /// <returns>Created document metadata</returns>
    [HttpPost("upload")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<DocumentDto>> Upload([FromForm] UploadDocumentForm form)
    {
        if (form.File == null || form.File.Length == 0)
        {
            return BadRequest(new { message = "File is required" });
        }

        if (string.IsNullOrWhiteSpace(form.Name))
        {
            return BadRequest(new { message = "Document name is required" });
        }

        if (!form.AgendaItemId.HasValue && !form.MeetingId.HasValue)
        {
            return BadRequest(new { message = "Either agendaItemId or meetingId must be provided" });
        }

        try
        {
            var request = new UploadDocumentRequest
            {
                AgendaItemId = form.AgendaItemId,
                MeetingId = form.MeetingId,
                Name = form.Name,
                Description = form.Description,
                Number = form.Number,
                IsPublic = form.IsPublic,
                IsLocked = form.IsLocked
            };

            var created = await _documentService.UploadAsync(form.File, request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document");
            return StatusCode(500, new { message = "An error occurred while uploading the document" });
        }
    }

    /// <summary>
    /// Download a document file
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>File stream</returns>
    [HttpGet("{id}/download")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Download(Guid id)
    {
        try
        {
            var (stream, fileName, mimeType) = await _documentService.DownloadAsync(id);
            return File(stream, mimeType, fileName);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Document not found" });
        }
        catch (FileNotFoundException)
        {
            return NotFound(new { message = "File not found on server" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading document {Id}", id);
            return StatusCode(500, new { message = "An error occurred while downloading the document" });
        }
    }

    /// <summary>
    /// Stream document for preview
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>File stream for preview</returns>
    [HttpGet("{id}/preview")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Preview(Guid id)
    {
        try
        {
            var document = await _documentService.GetByIdAsync(id);
            if (document == null)
            {
                return NotFound(new { message = "Document not found" });
            }

            var stream = await _documentService.GetFileStreamAsync(id);
            return File(stream, document.MimeType);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Document not found" });
        }
        catch (FileNotFoundException)
        {
            return NotFound(new { message = "File not found on server" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error previewing document {Id}", id);
            return StatusCode(500, new { message = "An error occurred while previewing the document" });
        }
    }

    /// <summary>
    /// Update document metadata (Secretary only)
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <param name="request">Updated metadata</param>
    /// <returns>Updated document</returns>
    [HttpPut("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DocumentDto>> Update(Guid id, [FromBody] UpdateDocumentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Document name is required" });
        }

        try
        {
            var updated = await _documentService.UpdateAsync(id, request);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Document not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating document {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the document" });
        }
    }

    /// <summary>
    /// Delete a document (Secretary only)
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = "SecretaryOnly")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var result = await _documentService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new { message = "Document not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting document {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the document" });
        }
    }
}
