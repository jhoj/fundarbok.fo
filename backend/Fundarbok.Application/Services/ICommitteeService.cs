using Fundarbok.Application.DTOs.Committee;

namespace Fundarbok.Application.Services;

public interface ICommitteeService
{
    Task<IEnumerable<CommitteeDto>> GetAllCommitteesAsync();
    Task<CommitteeDto?> GetCommitteeByIdAsync(Guid id);
    Task<CommitteeDto> CreateCommitteeAsync(CreateCommitteeRequest request);
    Task<CommitteeDto?> UpdateCommitteeAsync(Guid id, UpdateCommitteeRequest request);
    Task<bool> DeleteCommitteeAsync(Guid id);

    Task<IEnumerable<CommitteeMemberDto>> GetCommitteeMembersAsync(Guid committeeId);
    Task<CommitteeMemberDto> AddCommitteeMemberAsync(Guid committeeId, CreateCommitteeMemberRequest request);
    Task<CommitteeMemberDto?> UpdateCommitteeMemberAsync(Guid committeeId, Guid memberId, UpdateCommitteeMemberRequest request);
    Task<bool> DeleteCommitteeMemberAsync(Guid committeeId, Guid memberId);
}
