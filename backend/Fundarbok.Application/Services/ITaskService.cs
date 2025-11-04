using Fundarbok.Application.DTOs.Task;
using TaskDto = Fundarbok.Application.DTOs.Task.TaskDto;

namespace Fundarbok.Application.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetByAgendaItemIdAsync(Guid agendaItemId);
    Task<IEnumerable<TaskDto>> GetByUserIdAsync(Guid userId);
    Task<TaskDto?> GetByIdAsync(Guid id);
    Task<TaskDto> CreateAsync(Guid agendaItemId, CreateTaskRequest request);
    Task<TaskDto> UpdateAsync(Guid id, UpdateTaskRequest request);
    Task<TaskDto> ToggleCompleteAsync(Guid id);
    Task<bool> DeleteAsync(Guid id);
}
