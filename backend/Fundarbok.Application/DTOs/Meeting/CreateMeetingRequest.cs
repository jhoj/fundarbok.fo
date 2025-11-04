using System.ComponentModel.DataAnnotations;

namespace Fundarbok.Application.DTOs.Meeting;

public class CreateMeetingRequest
{
    [Required]
    public Guid CommitteeId { get; set; }

    public string? Title { get; set; }

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool IsOpen { get; set; } = true;

    [MaxLength(2000)]
    public string? Description { get; set; }

    public List<Guid>? ParticipantIds { get; set; }
}
