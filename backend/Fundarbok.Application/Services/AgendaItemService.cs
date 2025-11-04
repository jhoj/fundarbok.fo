using Fundarbok.Application.DTOs.AgendaItem;
using Fundarbok.Application.DTOs.Conclusion;
using Fundarbok.Application.DTOs.Document;
using Fundarbok.Application.DTOs.Note;
using Fundarbok.Application.DTOs.Recommendation;
using Fundarbok.Application.DTOs.Task;
using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Fundarbok.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NoteDto = Fundarbok.Application.DTOs.Note.NoteDto;
using TaskDto = Fundarbok.Application.DTOs.Task.TaskDto;

namespace Fundarbok.Application.Services;

public class AgendaItemService : IAgendaItemService
{
    private readonly IAgendaItemRepository _repository;
    private readonly FundarbokDbContext _context;

    public AgendaItemService(IAgendaItemRepository repository, FundarbokDbContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<IEnumerable<AgendaItemDto>> GetByMeetingIdAsync(Guid meetingId)
    {
        var items = await _repository.GetByMeetingIdAsync(meetingId);
        return items.Select(MapToDto);
    }

    public async Task<AgendaItemDetailDto?> GetByIdAsync(Guid id)
    {
        var item = await _repository.GetWithDetailsAsync(id);
        return item != null ? MapToDetailDto(item) : null;
    }

    public async Task<AgendaItemDto> CreateAsync(Guid meetingId, CreateAgendaItemRequest request)
    {
        // Get the next number for this meeting
        var existingItems = await _repository.GetByMeetingIdAsync(meetingId);
        var nextNumber = existingItems.Any() ? existingItems.Max(i => i.Number) + 1 : 1;

        var agendaItem = new AgendaItem
        {
            Id = Guid.NewGuid(),
            MeetingId = meetingId,
            Number = nextNumber,
            Title = request.Title,
            Description = request.Description
        };

        var created = await _repository.CreateAsync(agendaItem);
        return MapToDto(created);
    }

    public async Task<AgendaItemDto> UpdateAsync(Guid id, UpdateAgendaItemRequest request)
    {
        var agendaItem = await _repository.GetByIdAsync(id);
        if (agendaItem == null)
        {
            throw new KeyNotFoundException($"Agenda item with ID {id} not found");
        }

        agendaItem.Title = request.Title;
        agendaItem.Description = request.Description;

        var updated = await _repository.UpdateAsync(agendaItem);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<bool> ReorderAsync(Guid meetingId, ReorderAgendaItemsRequest request)
    {
        return await _repository.ReorderAsync(meetingId, request.OrderedIds);
    }

    private static AgendaItemDto MapToDto(AgendaItem item)
    {
        return new AgendaItemDto
        {
            Id = item.Id,
            MeetingId = item.MeetingId,
            Number = item.Number,
            Title = item.Title,
            Description = item.Description,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
            DocumentCount = item.Documents?.Count ?? 0,
            RecommendationCount = item.Recommendations?.Count ?? 0,
            ConclusionCount = item.Conclusions?.Count ?? 0
        };
    }

    private static AgendaItemDetailDto MapToDetailDto(AgendaItem item)
    {
        return new AgendaItemDetailDto
        {
            Id = item.Id,
            MeetingId = item.MeetingId,
            Number = item.Number,
            Title = item.Title,
            Description = item.Description,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
            Recommendations = item.Recommendations?.Select(r => new RecommendationDto
            {
                Id = r.Id,
                AgendaItemId = r.AgendaItemId,
                Text = r.Text,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            }).ToList() ?? new(),
            Documents = item.Documents?.Select(d => new DocumentDto
            {
                Id = d.Id,
                AgendaItemId = d.AgendaItemId,
                MeetingId = d.MeetingId,
                Name = d.Name,
                Description = d.Description,
                FileName = d.FileName,
                FileSize = d.FileSize,
                MimeType = d.MimeType,
                Number = d.Number,
                IsPublic = d.IsPublic,
                IsLocked = d.IsLocked,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            }).ToList() ?? new(),
            Conclusions = item.Conclusions?.Select(c => new ConclusionDto
            {
                Id = c.Id,
                AgendaItemId = c.AgendaItemId,
                Text = c.Text,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList() ?? new(),
            Notes = item.Notes?.Select(n => new NoteDto
            {
                Id = n.Id,
                AgendaItemId = n.AgendaItemId,
                UserId = n.UserId,
                UserName = n.User?.Name ?? string.Empty,
                Text = n.Text,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt
            }).ToList() ?? new(),
            Tasks = item.Tasks?.Select(t => new TaskDto
            {
                Id = t.Id,
                AgendaItemId = t.AgendaItemId,
                Description = t.Description,
                AssignedUserId = t.AssignedUserId,
                AssignedUserName = t.AssignedUser?.Name ?? string.Empty,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            }).ToList() ?? new()
        };
    }
}
