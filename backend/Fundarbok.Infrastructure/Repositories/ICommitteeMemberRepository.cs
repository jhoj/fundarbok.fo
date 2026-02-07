using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface ICommitteeMemberRepository
{
    Task<CommitteeMember?> GetByIdAsync(Guid id);
    Task<CommitteeMember> CreateAsync(CommitteeMember member);
    Task<CommitteeMember> UpdateAsync(CommitteeMember member);
    Task<bool> DeleteAsync(Guid id);
}
