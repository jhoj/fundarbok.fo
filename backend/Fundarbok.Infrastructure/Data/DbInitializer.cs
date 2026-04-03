using Fundarbok.Domain.Entities;

namespace Fundarbok.Infrastructure.Data;

public static class DbInitializer
{
    public static void Initialize(FundarbokDbContext context)
    {
        // Check if data already exists
        if (context.Users.Any())
        {
            return; // DB has been seeded
        }

        // Seed Users
        var secretaryUser = new User
        {
            Id = Guid.NewGuid(),
            Name = "Secretary Admin",
            Email = "secretary@fundarbok.fo",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"), // In production, use proper secure password
            Role = "Secretary",
            LanguagePreference = "fo",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var memberUser = new User
        {
            Id = Guid.NewGuid(),
            Name = "Jens Jensen",
            Email = "jens@fundarbok.fo",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "CommitteeMember",
            LanguagePreference = "fo",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Users.AddRange(secretaryUser, memberUser);
        context.SaveChanges();

        // Seed Committees
        var technicalCommittee = new Committee
        {
            Id = Guid.NewGuid(),
            Name = "Technical Committee",
            Description = "Tekniska nevndin - Handles technical matters and infrastructure",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var socialCommittee = new Committee
        {
            Id = Guid.NewGuid(),
            Name = "Social Committee",
            Description = "Sosiala nevndin - Handles social welfare and community matters",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Committees.AddRange(technicalCommittee, socialCommittee);
        context.SaveChanges();

        // Seed Committee Members
        var chairman = new CommitteeMember
        {
            Id = Guid.NewGuid(),
            CommitteeId = technicalCommittee.Id,
            Name = "Jens Jensen",
            Title = "Chairman",
            Role = "Chairman",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var member1 = new CommitteeMember
        {
            Id = Guid.NewGuid(),
            CommitteeId = technicalCommittee.Id,
            Name = "Anna Hansen",
            Title = "Member",
            Role = "Member",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var member2 = new CommitteeMember
        {
            Id = Guid.NewGuid(),
            CommitteeId = technicalCommittee.Id,
            Name = "Poul Petersen",
            Title = "Secretary",
            Role = "Secretary",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var socialChairman = new CommitteeMember
        {
            Id = Guid.NewGuid(),
            CommitteeId = socialCommittee.Id,
            Name = "Maria Mortensen",
            Title = "Chairman",
            Role = "Chairman",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.CommitteeMembers.AddRange(chairman, member1, member2, socialChairman);
        context.SaveChanges();

        // Update member user to link to committee member
        memberUser.CommitteeMemberId = chairman.Id;
        context.SaveChanges();

        // Seed a sample meeting
        var sampleMeeting = new Meeting
        {
            Id = Guid.NewGuid(),
            CommitteeId = technicalCommittee.Id,
            MeetingNumber = "1/2025",
            Title = "Regular Technical Committee Meeting",
            Location = "City Hall, Meeting Room A",
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(7).AddHours(2),
            IsOpen = true,
            IsCompleted = false,
            IsApproved = false,
            Description = "First meeting of 2025 - Review of ongoing projects and new proposals",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Meetings.Add(sampleMeeting);
        context.SaveChanges();

        // Seed meeting participants
        var participant1 = new MeetingParticipant
        {
            Id = Guid.NewGuid(),
            MeetingId = sampleMeeting.Id,
            CommitteeMemberId = chairman.Id,
            IsParticipating = true,
            CreatedAt = DateTime.UtcNow
        };

        var participant2 = new MeetingParticipant
        {
            Id = Guid.NewGuid(),
            MeetingId = sampleMeeting.Id,
            CommitteeMemberId = member1.Id,
            IsParticipating = true,
            CreatedAt = DateTime.UtcNow
        };

        context.MeetingParticipants.AddRange(participant1, participant2);
        context.SaveChanges();

        // Seed a sample agenda item
        var agendaItem1 = new AgendaItem
        {
            Id = Guid.NewGuid(),
            MeetingId = sampleMeeting.Id,
            Number = 1,
            Title = "Review of building permit application #2024-123",
            Description = "Discussion of building permit for new warehouse facility at Industrial Area North",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var agendaItem2 = new AgendaItem
        {
            Id = Guid.NewGuid(),
            MeetingId = sampleMeeting.Id,
            Number = 2,
            Title = "Budget allocation for infrastructure upgrades",
            Description = "Review and approve budget for road improvements in downtown area",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.AgendaItems.AddRange(agendaItem1, agendaItem2);
        context.SaveChanges();

        // Seed a recommendation for agenda item 1
        var recommendation = new Recommendation
        {
            Id = Guid.NewGuid(),
            AgendaItemId = agendaItem1.Id,
            Text = "The committee recommends approval of the building permit subject to compliance with environmental regulations and traffic impact assessment.",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Recommendations.Add(recommendation);
        context.SaveChanges();

        Console.WriteLine("Database seeded successfully!");
    }
}
