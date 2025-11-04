namespace Fundarbok.Application.DTOs.AgendaItem;

public class AgendaItemDto
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public int Number { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int DocumentCount { get; set; }
    public int RecommendationCount { get; set; }
    public int ConclusionCount { get; set; }
}
