namespace Fundarbok.Domain.Entities;

public class Conclusion
{
    public Guid Id { get; set; }
    public Guid AgendaItemId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public AgendaItem AgendaItem { get; set; } = null!;
}
