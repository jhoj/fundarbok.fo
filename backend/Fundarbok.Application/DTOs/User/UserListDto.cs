namespace Fundarbok.Application.DTOs.User;

public class UserListDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? CommitteeMemberId { get; set; }
    public string? CommitteeMemberName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
