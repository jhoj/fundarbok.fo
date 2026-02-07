namespace Fundarbok.Application.DTOs.Document;

public class UploadDocumentRequest
{
    public Guid? AgendaItemId { get; set; }
    public Guid? MeetingId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Number { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool IsLocked { get; set; } = false;
}
