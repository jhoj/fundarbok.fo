namespace Fundarbok.Domain.Entities;

public class CommitteeMember
{
    public Guid Id { get; set; }
    public Guid CommitteeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // Chairman, Member, Secretary, etc.
    public bool IsActive { get; set; } = true;
    public Guid? AlternateId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Committee Committee { get; set; } = null!;
    public CommitteeMember? Alternate { get; set; }
}
