namespace Fundarbok.Application.DTOs.AgendaItem;

public class UpdateAgendaItemRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}
