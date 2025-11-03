namespace Fundarbok.Domain.Entities;

public class Note
{
    public Guid Id { get; set; }
    public Guid AgendaItemId { get; set; }
    public Guid UserId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public AgendaItem AgendaItem { get; set; } = null!;
    public User User { get; set; } = null!;
}
