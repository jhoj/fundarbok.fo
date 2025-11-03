namespace Fundarbok.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // Secretary, CommitteeMember
    public Guid? CommitteeMemberId { get; set; } // Link to committee member
    public string LanguagePreference { get; set; } = "en";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Note> Notes { get; set; } = new List<Note>();
    public ICollection<AgendaTask> AssignedTasks { get; set; } = new List<AgendaTask>();
    public ICollection<PushSubscription> PushSubscriptions { get; set; } = new List<PushSubscription>();
}
