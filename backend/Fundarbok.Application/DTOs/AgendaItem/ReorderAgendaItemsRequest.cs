namespace Fundarbok.Application.DTOs.AgendaItem;

public class ReorderAgendaItemsRequest
{
    public List<Guid> OrderedIds { get; set; } = new();
}
