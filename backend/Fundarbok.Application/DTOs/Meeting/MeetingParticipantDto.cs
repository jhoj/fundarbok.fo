namespace Fundarbok.Application.DTOs.Meeting;

public class MeetingParticipantDto
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public Guid CommitteeMemberId { get; set; }
    public string CommitteeMemberName { get; set; } = string.Empty;
    public string CommitteeMemberTitle { get; set; } = string.Empty;
    public string CommitteeMemberRole { get; set; } = string.Empty;
    public bool IsParticipating { get; set; }
    public bool IsPresent { get; set; }
    public Guid? SubstituteForId { get; set; }
    public string? SubstituteForName { get; set; }
    public DateTime CreatedAt { get; set; }
}
