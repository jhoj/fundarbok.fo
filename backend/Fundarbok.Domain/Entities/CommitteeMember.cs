namespace Fundarbok.Domain.Entities;

public class CommitteeMember
{
    public Guid Id { get; set; }
    public Guid CommitteeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // Chairman, Member, Secretary, etc.
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public Committee Committee { get; set; } = null!;
}
