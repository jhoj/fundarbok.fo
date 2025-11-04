using Fundarbok.Application.DTOs.Document;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;

namespace Fundarbok.Application.Services;

public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _repository;
    private readonly IFileStorageService _fileStorageService;
    private const long MaxFileSizeBytes = 50 * 1024 * 1024; // 50MB

    private static readonly HashSet<string> AllowedMimeTypes = new()
    {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain"
    };

    public DocumentService(IDocumentRepository repository, IFileStorageService fileStorageService)
    {
        _repository = repository;
        _fileStorageService = fileStorageService;
    }

    public async Task<IEnumerable<DocumentDto>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        var documents = await _repository.GetByAgendaItemIdAsync(agendaItemId);
        return documents.Select(MapToDto);
    }

    public async Task<IEnumerable<DocumentDto>> GetByMeetingIdAsync(Guid meetingId)
    {
        var documents = await _repository.GetByMeetingIdAsync(meetingId);
        return documents.Select(MapToDto);
    }

    public async Task<DocumentDto?> GetByIdAsync(Guid id)
    {
        var document = await _repository.GetByIdAsync(id);
        return document != null ? MapToDto(document) : null;
    }

    public async Task<DocumentDto> UploadAsync(IFormFile file, UploadDocumentRequest request)
    {
        // Validate file
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is required");
        }

        if (file.Length > MaxFileSizeBytes)
        {
            throw new ArgumentException($"File size exceeds maximum allowed size of {MaxFileSizeBytes / (1024 * 1024)}MB");
        }

        if (!AllowedMimeTypes.Contains(file.ContentType))
        {
            throw new ArgumentException($"File type {file.ContentType} is not allowed");
        }

        // Determine folder based on AgendaItemId or MeetingId
        string folder;
        if (request.AgendaItemId.HasValue)
        {
            folder = $"agenda-items/{request.AgendaItemId}";
        }
        else if (request.MeetingId.HasValue)
        {
            folder = $"meetings/{request.MeetingId}";
        }
        else
        {
            throw new ArgumentException("Either AgendaItemId or MeetingId must be provided");
        }

        // Save file
        string filePath;
        using (var stream = file.OpenReadStream())
        {
            filePath = await _fileStorageService.SaveFileAsync(stream, file.FileName, folder);
        }

        // Create document entity
        var document = new Domain.Entities.Document
        {
            Id = Guid.NewGuid(),
            AgendaItemId = request.AgendaItemId,
            MeetingId = request.MeetingId,
            Name = request.Name,
            Description = request.Description,
            FilePath = filePath,
            FileName = file.FileName,
            FileSize = file.Length,
            MimeType = file.ContentType,
            Number = request.Number,
            IsPublic = request.IsPublic,
            IsLocked = request.IsLocked
        };

        var created = await _repository.CreateAsync(document);
        return MapToDto(created);
    }

    public async Task<DocumentDto> UpdateAsync(Guid id, UpdateDocumentRequest request)
    {
        var document = await _repository.GetByIdAsync(id);
        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        document.Name = request.Name;
        document.Description = request.Description;
        document.Number = request.Number;
        document.IsPublic = request.IsPublic;
        document.IsLocked = request.IsLocked;

        var updated = await _repository.UpdateAsync(document);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var document = await _repository.GetByIdAsync(id);
        if (document == null)
        {
            return false;
        }

        // Delete file from storage
        await _fileStorageService.DeleteFileAsync(document.FilePath);

        // Delete document record
        return await _repository.DeleteAsync(id);
    }

    public async Task<Stream> GetFileStreamAsync(Guid id)
    {
        var document = await _repository.GetByIdAsync(id);
        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        return await _fileStorageService.GetFileAsync(document.FilePath);
    }

    public async Task<(Stream stream, string fileName, string mimeType)> DownloadAsync(Guid id)
    {
        var document = await _repository.GetByIdAsync(id);
        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        var stream = await _fileStorageService.GetFileAsync(document.FilePath);
        return (stream, document.FileName, document.MimeType);
    }

    private static DocumentDto MapToDto(Domain.Entities.Document document)
    {
        return new DocumentDto
        {
            Id = document.Id,
            AgendaItemId = document.AgendaItemId,
            MeetingId = document.MeetingId,
            Name = document.Name,
            Description = document.Description,
            FileName = document.FileName,
            FileSize = document.FileSize,
            MimeType = document.MimeType,
            Number = document.Number,
            IsPublic = document.IsPublic,
            IsLocked = document.IsLocked,
            CreatedAt = document.CreatedAt,
            UpdatedAt = document.UpdatedAt
        };
    }
}
