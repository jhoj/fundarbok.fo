using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fundarbok.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrentAgendaItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CurrentAgendaItemId",
                table: "Meetings",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_CurrentAgendaItemId",
                table: "Meetings",
                column: "CurrentAgendaItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meetings_AgendaItems_CurrentAgendaItemId",
                table: "Meetings",
                column: "CurrentAgendaItemId",
                principalTable: "AgendaItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meetings_AgendaItems_CurrentAgendaItemId",
                table: "Meetings");

            migrationBuilder.DropIndex(
                name: "IX_Meetings_CurrentAgendaItemId",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "CurrentAgendaItemId",
                table: "Meetings");
        }
    }
}
