namespace Fundarbok.Domain.Entities;

public class AgendaItem
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public int Number { get; set; } // Ordering
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Meeting Meeting { get; set; } = null!;
    public ICollection<Recommendation> Recommendations { get; set; } = new List<Recommendation>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public ICollection<Conclusion> Conclusions { get; set; } = new List<Conclusion>();
    public ICollection<Note> Notes { get; set; } = new List<Note>();
    public ICollection<AgendaTask> Tasks { get; set; } = new List<AgendaTask>();
}
