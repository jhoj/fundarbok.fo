namespace Fundarbok.Domain.Entities;

public class MeetingParticipant
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public Guid CommitteeMemberId { get; set; }
    public bool IsParticipating { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Meeting Meeting { get; set; } = null!;
    public CommitteeMember CommitteeMember { get; set; } = null!;
}
