using Fundarbok.Application.DTOs.Document;
using Microsoft.AspNetCore.Http;

namespace Fundarbok.Application.Services;

public interface IDocumentService
{
    Task<IEnumerable<DocumentDto>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<IEnumerable<DocumentDto>> GetByMeetingIdAsync(Guid meetingId);
    Task<DocumentDto?> GetByIdAsync(Guid id);
    Task<DocumentDto> UploadAsync(IFormFile file, UploadDocumentRequest request);
    Task<DocumentDto> UpdateAsync(Guid id, UpdateDocumentRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<Stream> GetFileStreamAsync(Guid id);
    Task<(Stream stream, string fileName, string mimeType)> DownloadAsync(Guid id);
}
