namespace Fundarbok.Application.DTOs.Note;

public class NoteDto
{
    public Guid Id { get; set; }
    public Guid AgendaItemId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
