using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByCommitteeMemberIdAsync(Guid committeeMemberId);
    Task<List<User>> GetByCommitteeMemberIdsAsync(List<Guid> committeeMemberIds);
}
