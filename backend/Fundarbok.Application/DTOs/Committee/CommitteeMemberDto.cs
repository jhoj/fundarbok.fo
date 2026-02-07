namespace Fundarbok.Application.DTOs.Committee;

public class CommitteeMemberDto
{
    public Guid Id { get; set; }
    public Guid CommitteeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
