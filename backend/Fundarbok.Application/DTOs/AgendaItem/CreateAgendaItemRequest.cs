namespace Fundarbok.Application.DTOs.AgendaItem;

public class CreateAgendaItemRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}
