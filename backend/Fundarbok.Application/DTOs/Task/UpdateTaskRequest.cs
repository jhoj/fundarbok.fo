namespace Fundarbok.Application.DTOs.Task;

public class UpdateTaskRequest
{
    public string Description { get; set; } = string.Empty;
    public Guid AssignedUserId { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
}
