using Fundarbok.Application.DTOs.Conclusion;
using Fundarbok.Application.DTOs.Document;
using Fundarbok.Application.DTOs.Note;
using Fundarbok.Application.DTOs.Recommendation;
using Fundarbok.Application.DTOs.Task;

namespace Fundarbok.Application.DTOs.AgendaItem;

public class AgendaItemDetailDto
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public int Number { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<RecommendationDto> Recommendations { get; set; } = new();
    public List<DocumentDto> Documents { get; set; } = new();
    public List<ConclusionDto> Conclusions { get; set; } = new();
    public List<NoteDto> Notes { get; set; } = new();
    public List<TaskDto> Tasks { get; set; } = new();
}
