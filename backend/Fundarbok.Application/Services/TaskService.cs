using Fundarbok.Application.DTOs.Task;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Repositories;
using TaskDto = Fundarbok.Application.DTOs.Task.TaskDto;

namespace Fundarbok.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;

    public TaskService(ITaskRepository repository)
    {
        _repository = repository;
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
        return MapToDto(created);
    }

    public async Task<TaskDto> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task == null)
        {
            throw new KeyNotFoundException($"Task with ID {id} not found");
        }

        task.Description = request.Description;
        task.AssignedUserId = request.AssignedUserId;
        task.DueDate = request.DueDate;
        task.IsCompleted = request.IsCompleted;

        var updated = await _repository.UpdateAsync(task);
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
