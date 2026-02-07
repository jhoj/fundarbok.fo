using System.ComponentModel.DataAnnotations;

namespace Fundarbok.Application.DTOs.Meeting;

public class AddParticipantRequest
{
    [Required]
    public Guid CommitteeMemberId { get; set; }

    public bool IsParticipating { get; set; } = true;
}
