namespace Fundarbok.Application.DTOs.Document;

public class DocumentDto
{
    public Guid Id { get; set; }
    public Guid? AgendaItemId { get; set; }
    public Guid? MeetingId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string MimeType { get; set; } = string.Empty;
    public int Number { get; set; }
    public bool IsPublic { get; set; }
    public bool IsLocked { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
