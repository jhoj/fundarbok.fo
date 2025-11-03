namespace Fundarbok.Domain.Entities;

public class Document
{
    public Guid Id { get; set; }
    public Guid? AgendaItemId { get; set; } // Nullable for meeting-level docs
    public Guid? MeetingId { get; set; } // Nullable for agenda-level docs
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string MimeType { get; set; } = string.Empty;
    public int Number { get; set; } // Ordering
    public bool IsPublic { get; set; } = false;
    public bool IsLocked { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public AgendaItem? AgendaItem { get; set; }
    public Meeting? Meeting { get; set; }
}
