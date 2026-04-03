using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fundarbok.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAlternateAndAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPresent",
                table: "MeetingParticipants",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "SubstituteForId",
                table: "MeetingParticipants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AlternateId",
                table: "CommitteeMembers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingParticipants_SubstituteForId",
                table: "MeetingParticipants",
                column: "SubstituteForId");

            migrationBuilder.CreateIndex(
                name: "IX_CommitteeMembers_AlternateId",
                table: "CommitteeMembers",
                column: "AlternateId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommitteeMembers_CommitteeMembers_AlternateId",
                table: "CommitteeMembers",
                column: "AlternateId",
                principalTable: "CommitteeMembers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingParticipants_MeetingParticipants_SubstituteForId",
                table: "MeetingParticipants",
                column: "SubstituteForId",
                principalTable: "MeetingParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommitteeMembers_CommitteeMembers_AlternateId",
                table: "CommitteeMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingParticipants_MeetingParticipants_SubstituteForId",
                table: "MeetingParticipants");

            migrationBuilder.DropIndex(
                name: "IX_MeetingParticipants_SubstituteForId",
                table: "MeetingParticipants");

            migrationBuilder.DropIndex(
                name: "IX_CommitteeMembers_AlternateId",
                table: "CommitteeMembers");

            migrationBuilder.DropColumn(
                name: "IsPresent",
                table: "MeetingParticipants");

            migrationBuilder.DropColumn(
                name: "SubstituteForId",
                table: "MeetingParticipants");

            migrationBuilder.DropColumn(
                name: "AlternateId",
                table: "CommitteeMembers");
        }
    }
}
