using System.ComponentModel.DataAnnotations;

namespace Fundarbok.Application.DTOs.Committee;

public class UpdateCommitteeMemberRequest
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
    public string Name { get; set; } = string.Empty;

    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string? Title { get; set; }

    [Required(ErrorMessage = "Role is required")]
    [StringLength(100, ErrorMessage = "Role cannot exceed 100 characters")]
    public string Role { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}
