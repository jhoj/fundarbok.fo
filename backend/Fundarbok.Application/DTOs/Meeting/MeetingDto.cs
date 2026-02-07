namespace Fundarbok.Application.DTOs.Meeting;

public class MeetingDto
{
    public Guid Id { get; set; }
    public Guid CommitteeId { get; set; }
    public string CommitteeName { get; set; } = string.Empty;
    public string MeetingNumber { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsOpen { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsApproved { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
