using Fundarbok.Domain.Entities;
using Fundarbok.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Repositories;

public class MeetingRepository : IMeetingRepository
{
    private readonly FundarbokDbContext _context;

    public MeetingRepository(FundarbokDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Meeting>> GetAllAsync()
    {
        return await _context.Meetings
            .Include(m => m.Committee)
            .Include(m => m.MeetingParticipants)
                .ThenInclude(mp => mp.CommitteeMember)
            .OrderByDescending(m => m.StartDate)
            .ToListAsync();
    }

    public async Task<Meeting?> GetByIdAsync(Guid id)
    {
        return await _context.Meetings
            .Include(m => m.Committee)
            .Include(m => m.MeetingParticipants)
                .ThenInclude(mp => mp.CommitteeMember)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<Meeting?> GetWithDetailsAsync(Guid id)
    {
        return await _context.Meetings
            .Include(m => m.Committee)
            .Include(m => m.MeetingParticipants)
                .ThenInclude(mp => mp.CommitteeMember)
            .Include(m => m.AgendaItems.OrderBy(ai => ai.Number))
                .ThenInclude(ai => ai.Documents)
            .Include(m => m.AgendaItems)
                .ThenInclude(ai => ai.Recommendations)
            .Include(m => m.AgendaItems)
                .ThenInclude(ai => ai.Conclusions)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<IEnumerable<Meeting>> GetByCommitteeIdAsync(Guid committeeId)
    {
        return await _context.Meetings
            .Include(m => m.Committee)
            .Include(m => m.MeetingParticipants)
                .ThenInclude(mp => mp.CommitteeMember)
            .Where(m => m.CommitteeId == committeeId)
            .OrderByDescending(m => m.StartDate)
            .ToListAsync();
    }

    public async Task<Meeting> CreateAsync(Meeting meeting)
    {
        _context.Meetings.Add(meeting);
        await _context.SaveChangesAsync();
        return meeting;
    }

    public async Task<Meeting> UpdateAsync(Meeting meeting)
    {
        _context.Meetings.Update(meeting);
        await _context.SaveChangesAsync();
        return meeting;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null)
        {
            return false;
        }

        _context.Meetings.Remove(meeting);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<MeetingParticipant>> GetParticipantsAsync(Guid meetingId)
    {
        return await _context.MeetingParticipants
            .Include(mp => mp.CommitteeMember)
            .Where(mp => mp.MeetingId == meetingId)
            .ToListAsync();
    }

    public async Task<MeetingParticipant> AddParticipantAsync(MeetingParticipant participant)
    {
        _context.MeetingParticipants.Add(participant);
        await _context.SaveChangesAsync();
        return participant;
    }

    public async Task<bool> RemoveParticipantAsync(Guid meetingId, Guid participantId)
    {
        var participant = await _context.MeetingParticipants
            .FirstOrDefaultAsync(mp => mp.MeetingId == meetingId && mp.Id == participantId);

        if (participant == null)
        {
            return false;
        }

        _context.MeetingParticipants.Remove(participant);
        await _context.SaveChangesAsync();
        return true;
    }
}
