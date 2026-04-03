using System.ComponentModel.DataAnnotations;

namespace Fundarbok.Application.DTOs.User;

public class UpdateUserRequest
{
    [Required]
    [MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "CommitteeMember";

    public Guid? CommitteeMemberId { get; set; }

    public bool IsActive { get; set; } = true;
}
