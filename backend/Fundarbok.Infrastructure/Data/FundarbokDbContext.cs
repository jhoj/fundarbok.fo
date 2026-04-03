using Fundarbok.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Fundarbok.Infrastructure.Data;

public class FundarbokDbContext : DbContext
{
    public FundarbokDbContext(DbContextOptions<FundarbokDbContext> options) : base(options)
    {
    }

    // DbSet properties
    public DbSet<Committee> Committees => Set<Committee>();
    public DbSet<CommitteeMember> CommitteeMembers => Set<CommitteeMember>();
    public DbSet<Meeting> Meetings => Set<Meeting>();
    public DbSet<MeetingParticipant> MeetingParticipants => Set<MeetingParticipant>();
    public DbSet<AgendaItem> AgendaItems => Set<AgendaItem>();
    public DbSet<Recommendation> Recommendations => Set<Recommendation>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Conclusion> Conclusions => Set<Conclusion>();
    public DbSet<Note> Notes => Set<Note>();
    public DbSet<AgendaTask> AgendaTasks => Set<AgendaTask>();
    public DbSet<User> Users => Set<User>();
    public DbSet<PushSubscription> PushSubscriptions => Set<PushSubscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Committee configuration
        modelBuilder.Entity<Committee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // CommitteeMember configuration
        modelBuilder.Entity<CommitteeMember>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Committee)
                .WithMany(c => c.CommitteeMembers)
                .HasForeignKey(e => e.CommitteeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.CommitteeId);
        });

        // Meeting configuration
        modelBuilder.Entity<Meeting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MeetingNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(300);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Committee)
                .WithMany(c => c.Meetings)
                .HasForeignKey(e => e.CommitteeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.CommitteeId);
            entity.HasIndex(e => e.StartDate);

            entity.HasOne<AgendaItem>()
                .WithMany()
                .HasForeignKey(e => e.CurrentAgendaItemId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        });

        // MeetingParticipant configuration
        modelBuilder.Entity<MeetingParticipant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Meeting)
                .WithMany(m => m.MeetingParticipants)
                .HasForeignKey(e => e.MeetingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.CommitteeMember)
                .WithMany()
                .HasForeignKey(e => e.CommitteeMemberId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.MeetingId, e.CommitteeMemberId }).IsUnique();
        });

        // AgendaItem configuration
        modelBuilder.Entity<AgendaItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Description).HasMaxLength(5000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Meeting)
                .WithMany(m => m.AgendaItems)
                .HasForeignKey(e => e.MeetingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.MeetingId);
            entity.HasIndex(e => new { e.MeetingId, e.Number });
        });

        // Recommendation configuration
        modelBuilder.Entity<Recommendation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Text).IsRequired().HasMaxLength(5000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.AgendaItem)
                .WithMany(a => a.Recommendations)
                .HasForeignKey(e => e.AgendaItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.AgendaItemId);
        });

        // Document configuration
        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(300);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(300);
            entity.Property(e => e.MimeType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.AgendaItem)
                .WithMany(a => a.Documents)
                .HasForeignKey(e => e.AgendaItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Meeting)
                .WithMany(m => m.Documents)
                .HasForeignKey(e => e.MeetingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.AgendaItemId);
            entity.HasIndex(e => e.MeetingId);
        });

        // Conclusion configuration
        modelBuilder.Entity<Conclusion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Text).IsRequired().HasMaxLength(5000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.AgendaItem)
                .WithMany(a => a.Conclusions)
                .HasForeignKey(e => e.AgendaItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.AgendaItemId);
        });

        // Note configuration
        modelBuilder.Entity<Note>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Text).IsRequired().HasMaxLength(5000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.AgendaItem)
                .WithMany(a => a.Notes)
                .HasForeignKey(e => e.AgendaItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Notes)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.AgendaItemId);
            entity.HasIndex(e => e.UserId);
        });

        // AgendaTask configuration
        modelBuilder.Entity<AgendaTask>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.AgendaItem)
                .WithMany(a => a.Tasks)
                .HasForeignKey(e => e.AgendaItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.AssignedUser)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(e => e.AssignedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.AgendaItemId);
            entity.HasIndex(e => e.AssignedUserId);
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LanguagePreference).HasMaxLength(10);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Email).IsUnique();
        });

        // PushSubscription configuration
        modelBuilder.Entity<PushSubscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Endpoint).IsRequired().HasMaxLength(500);
            entity.Property(e => e.P256dh).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Auth).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany(u => u.PushSubscriptions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.UserId);
        });
    }
}
