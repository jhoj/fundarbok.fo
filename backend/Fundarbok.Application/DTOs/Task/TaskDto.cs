namespace Fundarbok.Application.DTOs.Task;

public class TaskDto
{
    public Guid Id { get; set; }
    public Guid AgendaItemId { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid AssignedUserId { get; set; }
    public string AssignedUserName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
