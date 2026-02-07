using Fundarbok.Application.DTOs.Task;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;
using Microsoft.Extensions.Logging;
using TaskDto = Fundarbok.Application.DTOs.Task.TaskDto;

namespace Fundarbok.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;
    private readonly IPushNotificationService _pushNotificationService;
    private readonly ILogger<TaskService> _logger;

    public TaskService(
        ITaskRepository repository,
        IPushNotificationService pushNotificationService,
        ILogger<TaskService> logger)
    {
        _repository = repository;
        _pushNotificationService = pushNotificationService;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskDto>> GetByAgendaItemIdAsync(Guid agendaItemId)
    {
        var tasks = await _repository.GetByAgendaItemIdAsync(agendaItemId);
        return tasks.Select(MapToDto);
    }

    public async Task<IEnumerable<TaskDto>> GetByUserIdAsync(Guid userId)
    {
        var tasks = await _repository.GetByUserIdAsync(userId);
        return tasks.Select(MapToDto);
    }

    public async Task<TaskDto?> GetByIdAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id);
        return task != null ? MapToDto(task) : null;
    }

    public async Task<TaskDto> CreateAsync(Guid agendaItemId, CreateTaskRequest request)
    {
        var task = new AgendaTask
        {
            Id = Guid.NewGuid(),
            AgendaItemId = agendaItemId,
            Description = request.Description,
            AssignedUserId = request.AssignedUserId,
            DueDate = request.DueDate,
            IsCompleted = false
        };

        var created = await _repository.CreateAsync(task);

        // Send push notification to assigned user
        try
        {
            if (request.AssignedUserId != Guid.Empty)
            {
                await _pushNotificationService.SendNotificationAsync(
                    request.AssignedUserId,
                    "Nýtt uppigjald",
                    $"Tú hevur fingið nýtt uppigjald: {request.Description}",
                    new {
                        type = "task_assigned",
                        taskId = created.Id,
                        agendaItemId = agendaItemId,
                        description = request.Description,
                        dueDate = request.DueDate
                    }
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification for task assignment");
            // Continue without throwing - notification failure shouldn't break the operation
        }

        return MapToDto(created);
    }

    public async Task<TaskDto> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task == null)
        {
            throw new KeyNotFoundException($"Task with ID {id} not found");
        }

        Guid? previousAssignedUserId = task.AssignedUserId;

        task.Description = request.Description;
        task.AssignedUserId = request.AssignedUserId;
        task.DueDate = request.DueDate;
        task.IsCompleted = request.IsCompleted;

        var updated = await _repository.UpdateAsync(task);

        // Send push notification if task was reassigned to a different user
        try
        {
            if (previousAssignedUserId != request.AssignedUserId && request.AssignedUserId != Guid.Empty)
            {
                await _pushNotificationService.SendNotificationAsync(
                    request.AssignedUserId,
                    "Uppigjald ásett",
                    $"Tú hevur fingið uppigjald: {request.Description}",
                    new {
                        type = "task_reassigned",
                        taskId = id,
                        agendaItemId = task.AgendaItemId,
                        description = request.Description,
                        dueDate = request.DueDate
                    }
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification for task reassignment");
            // Continue without throwing - notification failure shouldn't break the operation
        }

        return MapToDto(updated);
    }

    public async Task<TaskDto> ToggleCompleteAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task == null)
        {
            throw new KeyNotFoundException($"Task with ID {id} not found");
        }

        task.IsCompleted = !task.IsCompleted;

        var updated = await _repository.UpdateAsync(task);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static TaskDto MapToDto(AgendaTask task)
    {
        return new TaskDto
        {
            Id = task.Id,
            AgendaItemId = task.AgendaItemId,
            Description = task.Description,
            AssignedUserId = task.AssignedUserId,
            AssignedUserName = task.AssignedUser?.Name ?? string.Empty,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };
    }
}
