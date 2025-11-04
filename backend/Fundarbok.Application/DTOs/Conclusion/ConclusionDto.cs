namespace Fundarbok.Application.DTOs.Conclusion;

public class ConclusionDto
{
    public Guid Id { get; set; }
    public Guid AgendaItemId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
