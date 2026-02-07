namespace Fundarbok.Application.DTOs.Task;

public class CreateTaskRequest
{
    public string Description { get; set; } = string.Empty;
    public Guid AssignedUserId { get; set; }
    public DateTime? DueDate { get; set; }
}
