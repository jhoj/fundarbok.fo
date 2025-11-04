namespace Fundarbok.Application.DTOs.Auth;

public class AuthResult
{
    public bool Success { get; set; }
    public string Token { get; set; } = string.Empty;
    public UserDto? User { get; set; }
    public DateTime Expiration { get; set; }
    public string? ErrorMessage { get; set; }
}
