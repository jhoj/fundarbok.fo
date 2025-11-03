namespace Fundarbok.Domain.Entities;

public class Committee
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<CommitteeMember> CommitteeMembers { get; set; } = new List<CommitteeMember>();
    public ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
}
