using System.ComponentModel.DataAnnotations;

namespace Fundarbok.Application.DTOs.Meeting;

public class UpdateMeetingStatusRequest
{
    public bool? IsOpen { get; set; }
    public bool? IsCompleted { get; set; }
    public bool? IsApproved { get; set; }
}
