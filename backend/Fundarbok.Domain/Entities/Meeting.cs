namespace Fundarbok.Domain.Entities;

public class Meeting
{
    public Guid Id { get; set; }
    public Guid CommitteeId { get; set; }
    public string MeetingNumber { get; set; } = string.Empty; // e.g., "5/2022"
    public string? Title { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsOpen { get; set; } = true;
    public bool IsCompleted { get; set; } = false;
    public bool IsApproved { get; set; } = false;
    public string? Description { get; set; }
    public Guid? CurrentAgendaItemId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Committee Committee { get; set; } = null!;
    public ICollection<AgendaItem> AgendaItems { get; set; } = new List<AgendaItem>();
    public ICollection<MeetingParticipant> MeetingParticipants { get; set; } = new List<MeetingParticipant>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
