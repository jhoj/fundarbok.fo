using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Repositories;

public interface ICommitteeRepository
{
    Task<IEnumerable<Committee>> GetAllAsync();
    Task<Committee?> GetByIdAsync(Guid id);
    Task<Committee> CreateAsync(Committee committee);
    Task<Committee> UpdateAsync(Committee committee);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<CommitteeMember>> GetMembersAsync(Guid committeeId);
}
