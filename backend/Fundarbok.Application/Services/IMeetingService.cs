using Fundarbok.Application.DTOs.Meeting;

namespace Fundarbok.Application.Services;

public interface IMeetingService
{
    Task<IEnumerable<MeetingDto>> GetAllMeetingsAsync();
    Task<MeetingDto?> GetMeetingByIdAsync(Guid id);
    Task<MeetingDetailDto?> GetMeetingWithDetailsAsync(Guid id);
    Task<IEnumerable<MeetingDto>> GetMeetingsByCommitteeIdAsync(Guid committeeId);
    Task<MeetingDto> CreateMeetingAsync(CreateMeetingRequest request);
    Task<MeetingDto?> UpdateMeetingAsync(Guid id, UpdateMeetingRequest request);
    Task<bool> DeleteMeetingAsync(Guid id);
    Task<MeetingDto?> UpdateMeetingStatusAsync(Guid id, UpdateMeetingStatusRequest request);

    Task<IEnumerable<MeetingParticipantDto>> GetMeetingParticipantsAsync(Guid meetingId);
    Task<MeetingParticipantDto> AddParticipantAsync(Guid meetingId, AddParticipantRequest request);
    Task<bool> RemoveParticipantAsync(Guid meetingId, Guid participantId);
}
