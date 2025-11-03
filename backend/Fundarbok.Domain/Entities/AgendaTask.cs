namespace Fundarbok.Domain.Entities;

// Note: Renamed from "Task" to "AgendaTask" to avoid conflict with System.Threading.Tasks.Task
public class AgendaTask
{
    public Guid Id { get; set; }
    public Guid AgendaItemId { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid AssignedUserId { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public AgendaItem AgendaItem { get; set; } = null!;
    public User AssignedUser { get; set; } = null!;
}
