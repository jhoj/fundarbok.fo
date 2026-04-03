using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface IMeetingRepository
{
    Task<IEnumerable<Meeting>> GetAllAsync();
    Task<Meeting?> GetByIdAsync(Guid id);
    Task<Meeting?> GetWithDetailsAsync(Guid id);
    Task<IEnumerable<Meeting>> GetByCommitteeIdAsync(Guid committeeId);
    Task<Meeting> CreateAsync(Meeting meeting);
    Task<Meeting> UpdateAsync(Meeting meeting);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<MeetingParticipant>> GetParticipantsAsync(Guid meetingId);
    Task<MeetingParticipant> AddParticipantAsync(MeetingParticipant participant);
    Task<MeetingParticipant?> GetParticipantAsync(Guid meetingId, Guid participantId);
    Task<MeetingParticipant> UpdateParticipantAsync(MeetingParticipant participant);
    Task<bool> RemoveParticipantAsync(Guid meetingId, Guid participantId);
}
