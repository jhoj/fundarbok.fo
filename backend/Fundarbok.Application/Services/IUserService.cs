using Fundarbok.Application.DTOs.User;

namespace Fundarbok.Application.Services;

public interface IUserService
{
    Task<List<UserListDto>> GetAllUsersAsync();
    Task<UserListDto?> GetUserByIdAsync(Guid id);
    Task<UserListDto> CreateUserAsync(CreateUserRequest request);
    Task<UserListDto?> UpdateUserAsync(Guid id, UpdateUserRequest request);
    Task<bool> DeleteUserAsync(Guid id);
}
