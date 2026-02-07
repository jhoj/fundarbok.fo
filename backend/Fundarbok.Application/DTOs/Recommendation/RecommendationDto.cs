namespace Fundarbok.Application.DTOs.Recommendation;

public class RecommendationDto
{
    public Guid Id { get; set; }
    public Guid AgendaItemId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
