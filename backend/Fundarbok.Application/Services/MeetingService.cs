using Fundarbok.Application.DTOs.Meeting;
using Fundarbok.Application.DTOs.AgendaItem;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;
using Microsoft.Extensions.Logging;

namespace Fundarbok.Application.Services;

public class MeetingService : IMeetingService
{
    private readonly IMeetingRepository _meetingRepository;
    private readonly ICommitteeRepository _committeeRepository;
    private readonly ILogger<MeetingService> _logger;

    public MeetingService(
        IMeetingRepository meetingRepository,
        ICommitteeRepository committeeRepository,
        ILogger<MeetingService> logger)
    {
        _meetingRepository = meetingRepository;
        _committeeRepository = committeeRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<MeetingDto>> GetAllMeetingsAsync(Guid? committeeId = null, DateTime? startDate = null, DateTime? endDate = null, bool? isCompleted = null, bool? isApproved = null)
    {
        var meetings = await _meetingRepository.GetAllAsync();

        // Apply filters
        if (committeeId.HasValue)
        {
            meetings = meetings.Where(m => m.CommitteeId == committeeId.Value);
        }

        if (startDate.HasValue)
        {
            meetings = meetings.Where(m => m.StartDate >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            meetings = meetings.Where(m => m.StartDate <= endDate.Value);
        }

        if (isCompleted.HasValue)
        {
            meetings = meetings.Where(m => m.IsCompleted == isCompleted.Value);
        }

        if (isApproved.HasValue)
        {
            meetings = meetings.Where(m => m.IsApproved == isApproved.Value);
        }

        return meetings.Select(MapToMeetingDto);
    }

    public async Task<MeetingDto?> GetMeetingByIdAsync(Guid id)
    {
        var meeting = await _meetingRepository.GetByIdAsync(id);
        return meeting != null ? MapToMeetingDto(meeting) : null;
    }

    public async Task<MeetingDetailDto?> GetMeetingWithDetailsAsync(Guid id)
    {
        var meeting = await _meetingRepository.GetWithDetailsAsync(id);
        return meeting != null ? MapToMeetingDetailDto(meeting) : null;
    }

    public async Task<IEnumerable<MeetingDto>> GetMeetingsByCommitteeIdAsync(Guid committeeId)
    {
        var meetings = await _meetingRepository.GetByCommitteeIdAsync(committeeId);
        return meetings.Select(MapToMeetingDto);
    }

    public async Task<MeetingDto> CreateMeetingAsync(CreateMeetingRequest request)
    {
        // Validate committee exists
        var committee = await _committeeRepository.GetByIdAsync(request.CommitteeId);
        if (committee == null)
        {
            throw new InvalidOperationException($"Committee with ID {request.CommitteeId} not found");
        }

        // Validate dates
        if (request.EndDate <= request.StartDate)
        {
            throw new InvalidOperationException("End date must be after start date");
        }

        // Generate meeting number (format: "SequenceNumber/Year")
        var committeeMeetings = await _meetingRepository.GetByCommitteeIdAsync(request.CommitteeId);
        var currentYear = request.StartDate.Year;
        var meetingsInYear = committeeMeetings.Count(m => m.StartDate.Year == currentYear);
        var meetingNumber = $"{meetingsInYear + 1}/{currentYear}";

        var meeting = new Meeting
        {
            Id = Guid.NewGuid(),
            CommitteeId = request.CommitteeId,
            MeetingNumber = meetingNumber,
            Title = request.Title,
            Location = request.Location,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsOpen = request.IsOpen,
            IsCompleted = false,
            IsApproved = false,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdMeeting = await _meetingRepository.CreateAsync(meeting);
        _logger.LogInformation("Created meeting {MeetingNumber} for committee {CommitteeId}", createdMeeting.MeetingNumber, request.CommitteeId);

        // Add participants if provided
        if (request.ParticipantIds != null && request.ParticipantIds.Any())
        {
            foreach (var participantId in request.ParticipantIds)
            {
                var participant = new MeetingParticipant
                {
                    Id = Guid.NewGuid(),
                    MeetingId = createdMeeting.Id,
                    CommitteeMemberId = participantId,
                    IsParticipating = true,
                    CreatedAt = DateTime.UtcNow
                };
                await _meetingRepository.AddParticipantAsync(participant);
            }
        }

        return MapToMeetingDto(createdMeeting);
    }

    public async Task<MeetingDto?> UpdateMeetingAsync(Guid id, UpdateMeetingRequest request)
    {
        var meeting = await _meetingRepository.GetByIdAsync(id);
        if (meeting == null)
        {
            return null;
        }

        // Check if meeting is locked (approved)
        if (meeting.IsApproved)
        {
            throw new InvalidOperationException("Cannot update an approved meeting");
        }

        // Update fields if provided
        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            meeting.Title = request.Title;
        }

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            meeting.Location = request.Location;
        }

        if (request.StartDate.HasValue)
        {
            meeting.StartDate = request.StartDate.Value;
        }

        if (request.EndDate.HasValue)
        {
            meeting.EndDate = request.EndDate.Value;
        }

        // Validate dates
        if (meeting.EndDate <= meeting.StartDate)
        {
            throw new InvalidOperationException("End date must be after start date");
        }

        if (request.IsOpen.HasValue)
        {
            meeting.IsOpen = request.IsOpen.Value;
        }

        if (request.Description != null)
        {
            meeting.Description = request.Description;
        }

        meeting.UpdatedAt = DateTime.UtcNow;

        var updatedMeeting = await _meetingRepository.UpdateAsync(meeting);
        _logger.LogInformation("Updated meeting {MeetingId}", updatedMeeting.Id);

        return MapToMeetingDto(updatedMeeting);
    }

    public async Task<bool> DeleteMeetingAsync(Guid id)
    {
        var meeting = await _meetingRepository.GetByIdAsync(id);
        if (meeting == null)
        {
            return false;
        }

        // Check if meeting is locked (approved)
        if (meeting.IsApproved)
        {
            throw new InvalidOperationException("Cannot delete an approved meeting");
        }

        var result = await _meetingRepository.DeleteAsync(id);
        if (result)
        {
            _logger.LogInformation("Deleted meeting {MeetingId}", id);
        }

        return result;
    }

    public async Task<MeetingDto?> UpdateMeetingStatusAsync(Guid id, UpdateMeetingStatusRequest request)
    {
        var meeting = await _meetingRepository.GetByIdAsync(id);
        if (meeting == null)
        {
            return null;
        }

        // Validate status transitions
        if (request.IsApproved == true && !meeting.IsCompleted)
        {
            throw new InvalidOperationException("Cannot approve a meeting that is not completed");
        }

        if (request.IsOpen.HasValue)
        {
            meeting.IsOpen = request.IsOpen.Value;
        }

        if (request.IsCompleted.HasValue)
        {
            meeting.IsCompleted = request.IsCompleted.Value;
        }

        if (request.IsApproved.HasValue)
        {
            if (request.IsApproved.Value)
            {
                // When approving, automatically close the meeting
                meeting.IsOpen = false;
                meeting.IsCompleted = true;
            }
            meeting.IsApproved = request.IsApproved.Value;
        }

        meeting.UpdatedAt = DateTime.UtcNow;

        var updatedMeeting = await _meetingRepository.UpdateAsync(meeting);
        _logger.LogInformation("Updated meeting status for {MeetingId}", updatedMeeting.Id);

        return MapToMeetingDto(updatedMeeting);
    }

    public async Task<IEnumerable<MeetingParticipantDto>> GetMeetingParticipantsAsync(Guid meetingId)
    {
        var participants = await _meetingRepository.GetParticipantsAsync(meetingId);
        return participants.Select(MapToMeetingParticipantDto);
    }

    public async Task<MeetingParticipantDto> AddParticipantAsync(Guid meetingId, AddParticipantRequest request)
    {
        // Verify meeting exists
        var meeting = await _meetingRepository.GetByIdAsync(meetingId);
        if (meeting == null)
        {
            throw new InvalidOperationException($"Meeting with ID {meetingId} not found");
        }

        // Check if meeting is locked (approved)
        if (meeting.IsApproved)
        {
            throw new InvalidOperationException("Cannot add participants to an approved meeting");
        }

        var participant = new MeetingParticipant
        {
            Id = Guid.NewGuid(),
            MeetingId = meetingId,
            CommitteeMemberId = request.CommitteeMemberId,
            IsParticipating = request.IsParticipating,
            CreatedAt = DateTime.UtcNow
        };

        var createdParticipant = await _meetingRepository.AddParticipantAsync(participant);
        _logger.LogInformation("Added participant {CommitteeMemberId} to meeting {MeetingId}", request.CommitteeMemberId, meetingId);

        return MapToMeetingParticipantDto(createdParticipant);
    }

    public async Task<bool> RemoveParticipantAsync(Guid meetingId, Guid participantId)
    {
        // Verify meeting exists
        var meeting = await _meetingRepository.GetByIdAsync(meetingId);
        if (meeting == null)
        {
            return false;
        }

        // Check if meeting is locked (approved)
        if (meeting.IsApproved)
        {
            throw new InvalidOperationException("Cannot remove participants from an approved meeting");
        }

        var result = await _meetingRepository.RemoveParticipantAsync(meetingId, participantId);
        if (result)
        {
            _logger.LogInformation("Removed participant {ParticipantId} from meeting {MeetingId}", participantId, meetingId);
        }

        return result;
    }

    private static MeetingDto MapToMeetingDto(Meeting meeting)
    {
        return new MeetingDto
        {
            Id = meeting.Id,
            CommitteeId = meeting.CommitteeId,
            CommitteeName = meeting.Committee?.Name ?? string.Empty,
            MeetingNumber = meeting.MeetingNumber,
            Title = meeting.Title,
            Location = meeting.Location,
            StartDate = meeting.StartDate,
            EndDate = meeting.EndDate,
            IsOpen = meeting.IsOpen,
            IsCompleted = meeting.IsCompleted,
            IsApproved = meeting.IsApproved,
            Description = meeting.Description,
            CreatedAt = meeting.CreatedAt,
            UpdatedAt = meeting.UpdatedAt
        };
    }

    private static MeetingDetailDto MapToMeetingDetailDto(Meeting meeting)
    {
        return new MeetingDetailDto
        {
            Id = meeting.Id,
            CommitteeId = meeting.CommitteeId,
            CommitteeName = meeting.Committee?.Name ?? string.Empty,
            MeetingNumber = meeting.MeetingNumber,
            Title = meeting.Title,
            Location = meeting.Location,
            StartDate = meeting.StartDate,
            EndDate = meeting.EndDate,
            IsOpen = meeting.IsOpen,
            IsCompleted = meeting.IsCompleted,
            IsApproved = meeting.IsApproved,
            Description = meeting.Description,
            CreatedAt = meeting.CreatedAt,
            UpdatedAt = meeting.UpdatedAt,
            Participants = meeting.MeetingParticipants?.Select(MapToMeetingParticipantDto).ToList() ?? new(),
            AgendaItems = meeting.AgendaItems?.Select(MapToAgendaItemDto).ToList() ?? new()
        };
    }

    private static MeetingParticipantDto MapToMeetingParticipantDto(MeetingParticipant participant)
    {
        return new MeetingParticipantDto
        {
            Id = participant.Id,
            MeetingId = participant.MeetingId,
            CommitteeMemberId = participant.CommitteeMemberId,
            CommitteeMemberName = participant.CommitteeMember?.Name ?? string.Empty,
            CommitteeMemberTitle = participant.CommitteeMember?.Title ?? string.Empty,
            CommitteeMemberRole = participant.CommitteeMember?.Role ?? string.Empty,
            IsParticipating = participant.IsParticipating,
            CreatedAt = participant.CreatedAt
        };
    }

    private static AgendaItemDto MapToAgendaItemDto(AgendaItem agendaItem)
    {
        return new AgendaItemDto
        {
            Id = agendaItem.Id,
            MeetingId = agendaItem.MeetingId,
            Number = agendaItem.Number,
            Title = agendaItem.Title,
            Description = agendaItem.Description,
            CreatedAt = agendaItem.CreatedAt,
            UpdatedAt = agendaItem.UpdatedAt,
            DocumentCount = agendaItem.Documents?.Count ?? 0,
            RecommendationCount = agendaItem.Recommendations?.Count ?? 0,
            ConclusionCount = agendaItem.Conclusions?.Count ?? 0
        };
    }
}
