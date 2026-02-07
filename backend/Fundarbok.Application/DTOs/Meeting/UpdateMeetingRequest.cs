using System.ComponentModel.DataAnnotations;

namespace Fundarbok.Application.DTOs.Meeting;

public class UpdateMeetingRequest
{
    [MaxLength(200)]
    public string? Title { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool? IsOpen { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }
}
