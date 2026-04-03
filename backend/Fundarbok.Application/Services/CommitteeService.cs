using Fundarbok.Application.DTOs.Committee;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;
using Microsoft.Extensions.Logging;

namespace Fundarbok.Application.Services;

public class CommitteeService : ICommitteeService
{
    private readonly ICommitteeRepository _committeeRepository;
    private readonly ICommitteeMemberRepository _committeeMemberRepository;
    private readonly ILogger<CommitteeService> _logger;

    public CommitteeService(
        ICommitteeRepository committeeRepository,
        ICommitteeMemberRepository committeeMemberRepository,
        ILogger<CommitteeService> logger)
    {
        _committeeRepository = committeeRepository;
        _committeeMemberRepository = committeeMemberRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<CommitteeDto>> GetAllCommitteesAsync()
    {
        var committees = await _committeeRepository.GetAllAsync();
        return committees.Select(MapToCommitteeDto);
    }

    public async Task<CommitteeDto?> GetCommitteeByIdAsync(Guid id)
    {
        var committee = await _committeeRepository.GetByIdAsync(id);
        return committee != null ? MapToCommitteeDto(committee) : null;
    }

    public async Task<CommitteeDto> CreateCommitteeAsync(CreateCommitteeRequest request)
    {
        // Check for duplicate names
        var existingCommittees = await _committeeRepository.GetAllAsync();
        if (existingCommittees.Any(c => c.Name.Equals(request.Name, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException($"A committee with the name '{request.Name}' already exists");
        }

        var committee = new Committee
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdCommittee = await _committeeRepository.CreateAsync(committee);
        _logger.LogInformation("Created committee {CommitteeName} with ID {CommitteeId}", createdCommittee.Name, createdCommittee.Id);

        return MapToCommitteeDto(createdCommittee);
    }

    public async Task<CommitteeDto?> UpdateCommitteeAsync(Guid id, UpdateCommitteeRequest request)
    {
        var committee = await _committeeRepository.GetByIdAsync(id);
        if (committee == null)
        {
            return null;
        }

        // Check for duplicate names (excluding current committee)
        var existingCommittees = await _committeeRepository.GetAllAsync();
        if (existingCommittees.Any(c => c.Id != id && c.Name.Equals(request.Name, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException($"A committee with the name '{request.Name}' already exists");
        }

        committee.Name = request.Name;
        committee.Description = request.Description;
        committee.UpdatedAt = DateTime.UtcNow;

        var updatedCommittee = await _committeeRepository.UpdateAsync(committee);
        _logger.LogInformation("Updated committee {CommitteeId}", updatedCommittee.Id);

        return MapToCommitteeDto(updatedCommittee);
    }

    public async Task<bool> DeleteCommitteeAsync(Guid id)
    {
        var committee = await _committeeRepository.GetByIdAsync(id);
        if (committee == null)
        {
            return false;
        }

        // Check if committee has any meetings
        if (committee.Meetings?.Any() == true)
        {
            throw new InvalidOperationException("Cannot delete a committee that has meetings. Delete the meetings first.");
        }

        var result = await _committeeRepository.DeleteAsync(id);
        if (result)
        {
            _logger.LogInformation("Deleted committee {CommitteeId}", id);
        }

        return result;
    }

    public async Task<IEnumerable<CommitteeMemberDto>> GetCommitteeMembersAsync(Guid committeeId)
    {
        var members = await _committeeRepository.GetMembersAsync(committeeId);
        return members.Select(MapToCommitteeMemberDto);
    }

    public async Task<CommitteeMemberDto> AddCommitteeMemberAsync(Guid committeeId, CreateCommitteeMemberRequest request)
    {
        // Verify committee exists
        var committee = await _committeeRepository.GetByIdAsync(committeeId);
        if (committee == null)
        {
            throw new InvalidOperationException($"Committee with ID {committeeId} not found");
        }

        var member = new CommitteeMember
        {
            Id = Guid.NewGuid(),
            CommitteeId = committeeId,
            Name = request.Name,
            Title = request.Title,
            Role = request.Role,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdMember = await _committeeMemberRepository.CreateAsync(member);
        _logger.LogInformation("Added member {MemberName} to committee {CommitteeId}", createdMember.Name, committeeId);

        return MapToCommitteeMemberDto(createdMember);
    }

    public async Task<CommitteeMemberDto?> UpdateCommitteeMemberAsync(Guid committeeId, Guid memberId, UpdateCommitteeMemberRequest request)
    {
        var member = await _committeeMemberRepository.GetByIdAsync(memberId);
        if (member == null || member.CommitteeId != committeeId)
        {
            return null;
        }

        member.Name = request.Name;
        member.Title = request.Title;
        member.Role = request.Role;
        member.IsActive = request.IsActive;
        member.AlternateId = request.AlternateId;
        member.UpdatedAt = DateTime.UtcNow;

        var updatedMember = await _committeeMemberRepository.UpdateAsync(member);
        _logger.LogInformation("Updated committee member {MemberId}", updatedMember.Id);

        return MapToCommitteeMemberDto(updatedMember);
    }

    public async Task<bool> DeleteCommitteeMemberAsync(Guid committeeId, Guid memberId)
    {
        var member = await _committeeMemberRepository.GetByIdAsync(memberId);
        if (member == null || member.CommitteeId != committeeId)
        {
            return false;
        }

        var result = await _committeeMemberRepository.DeleteAsync(memberId);
        if (result)
        {
            _logger.LogInformation("Deleted committee member {MemberId} from committee {CommitteeId}", memberId, committeeId);
        }

        return result;
    }

    private static CommitteeDto MapToCommitteeDto(Committee committee)
    {
        return new CommitteeDto
        {
            Id = committee.Id,
            Name = committee.Name,
            Description = committee.Description,
            CreatedAt = committee.CreatedAt,
            UpdatedAt = committee.UpdatedAt,
            MemberCount = committee.CommitteeMembers?.Count ?? 0,
            MeetingCount = committee.Meetings?.Count ?? 0
        };
    }

    private static CommitteeMemberDto MapToCommitteeMemberDto(CommitteeMember member)
    {
        return new CommitteeMemberDto
        {
            Id = member.Id,
            CommitteeId = member.CommitteeId,
            Name = member.Name,
            Title = member.Title,
            Role = member.Role,
            IsActive = member.IsActive,
            AlternateId = member.AlternateId,
            AlternateName = member.Alternate?.Name,
            CreatedAt = member.CreatedAt
        };
    }
}
