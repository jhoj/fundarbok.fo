using Fundarbok.Application.DTOs.User;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Application.Services;

public class UserService : IUserService
{
    private readonly FundarbokDbContext _context;

    public UserService(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserListDto>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .OrderBy(u => u.Name)
            .ToListAsync();

        var committeeMemberIds = users
            .Where(u => u.CommitteeMemberId.HasValue)
            .Select(u => u.CommitteeMemberId!.Value)
            .ToList();

        var memberNames = await _context.CommitteeMembers
            .Where(cm => committeeMemberIds.Contains(cm.Id))
            .ToDictionaryAsync(cm => cm.Id, cm => cm.Name);

        return users.Select(u => MapToDto(u, memberNames)).ToList();
    }

    public async Task<UserListDto?> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        string? memberName = null;
        if (user.CommitteeMemberId.HasValue)
        {
            memberName = await _context.CommitteeMembers
                .Where(cm => cm.Id == user.CommitteeMemberId.Value)
                .Select(cm => cm.Name)
                .FirstOrDefaultAsync();
        }

        return MapToDto(user, memberName != null
            ? new Dictionary<Guid, string> { { user.CommitteeMemberId!.Value, memberName } }
            : new Dictionary<Guid, string>());
    }

    public async Task<UserListDto> CreateUserAsync(CreateUserRequest request)
    {
        var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existing != null)
            throw new InvalidOperationException("A user with this email already exists");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            CommitteeMemberId = request.CommitteeMemberId,
            LanguagePreference = "fo",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return (await GetUserByIdAsync(user.Id))!;
    }

    public async Task<UserListDto?> UpdateUserAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        // Check email uniqueness if changed
        if (user.Email != request.Email)
        {
            var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existing != null)
                throw new InvalidOperationException("A user with this email already exists");
        }

        user.Name = request.Name;
        user.Email = request.Email;
        user.Role = request.Role;
        user.CommitteeMemberId = request.CommitteeMemberId;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return (await GetUserByIdAsync(user.Id))!;
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    private static UserListDto MapToDto(User user, Dictionary<Guid, string> memberNames)
    {
        return new UserListDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CommitteeMemberId = user.CommitteeMemberId,
            CommitteeMemberName = user.CommitteeMemberId.HasValue && memberNames.ContainsKey(user.CommitteeMemberId.Value)
                ? memberNames[user.CommitteeMemberId.Value]
                : null,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }
}
