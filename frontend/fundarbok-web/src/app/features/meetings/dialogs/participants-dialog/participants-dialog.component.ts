import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { MeetingParticipant } from '../../../../models/meeting.model';
import { CommitteeMember } from '../../../../models/committee.model';
import { MeetingService } from '../../../../core/services/meeting.service';
import { CommitteeService } from '../../../../core/services/committee.service';
import { AuthService } from '../../../../core/services/auth.service';
import { GrantAccessDialogComponent, GrantAccessDialogData } from '../grant-access-dialog/grant-access-dialog.component';

export interface ParticipantsDialogData {
  meetingId: string;
  committeeId: string;
  committeeName: string;
  committeeDescription?: string;
}

@Component({
  selector: 'app-participants-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  templateUrl: './participants-dialog.component.html',
  styleUrl: './participants-dialog.component.scss'
})
export class ParticipantsDialogComponent implements OnInit {
  participants: MeetingParticipant[] = [];
  committeeMembers: CommitteeMember[] = [];
  displayedColumns: string[] = ['name', 'title', 'role', 'present', 'participating'];
  isSecretary = false;
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<ParticipantsDialogComponent>,
    private meetingService: MeetingService,
    private committeeService: CommitteeService,
    private authService: AuthService,
    private translationService: TranslationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ParticipantsDialogData
  ) {
    this.isSecretary = this.authService.hasRole('Secretary');
  }

  ngOnInit(): void {
    this.loadParticipants();
    this.loadCommitteeMembers();
  }

  loadParticipants(): void {
    this.loading = true;
    this.meetingService.getMeetingById(this.data.meetingId).subscribe({
      next: (meeting) => {
        if (meeting.participants) {
          this.participants = meeting.participants;
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load participants', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadCommitteeMembers(): void {
    this.committeeService.getMembers(this.data.committeeId).subscribe({
      next: (members) => {
        this.committeeMembers = members;
      }
    });
  }

  onAttendanceToggle(participant: MeetingParticipant, event: any): void {
    const isPresent = event.checked;

    this.meetingService.updateAttendance(this.data.meetingId, participant.id, isPresent).subscribe({
      next: () => {
        participant.isPresent = isPresent;

        // If marked absent, check for alternate and suggest adding
        if (!isPresent) {
          const member = this.committeeMembers.find(m => m.id === participant.committeeMemberId);
          if (member?.alternateId && member?.alternateName) {
            const alreadyParticipant = this.participants.some(p => p.committeeMemberId === member.alternateId);
            if (!alreadyParticipant) {
              const message = this.translationService.translate('meetings.participants.suggestAlternate')
                .replace('[name]', member.alternateName);
              const ref = this.snackBar.open(message, this.translationService.translate('common.actions.add'), { duration: 8000 });
              ref.onAction().subscribe(() => {
                this.addSubstitute(member.alternateId!, participant.id);
              });
            }
          }
        }
      },
      error: () => {
        this.snackBar.open('Failed to update attendance', 'Close', { duration: 3000 });
      }
    });
  }

  addSubstitute(committeeMemberId: string, substituteForId: string): void {
    this.meetingService.addParticipant(this.data.meetingId, {
      committeeMemberId,
      isParticipating: true,
      substituteForId
    }).subscribe({
      next: () => {
        this.loadParticipants();
        this.snackBar.open(
          this.translationService.translate('meetings.participants.participantAdded'),
          'Close',
          { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open('Failed to add substitute', 'Close', { duration: 3000 });
      }
    });
  }

  onParticipationToggle(participant: MeetingParticipant, event: any): void {
    const newStatus = event.checked;

    this.meetingService.addParticipant(this.data.meetingId, {
      committeeMemberId: participant.committeeMemberId,
      isParticipating: newStatus
    }).subscribe({
      next: () => {
        participant.isParticipating = newStatus;
        this.snackBar.open(
          this.translationService.translate('meetings.participants.participationUpdated'),
          'Close',
          { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open('Failed to update participation', 'Close', { duration: 3000 });
      }
    });
  }

  openGrantAccessDialog(): void {
    const dialogData: GrantAccessDialogData = {
      meetingId: this.data.meetingId,
      committeeId: this.data.committeeId
    };

    const dialogRef = this.dialog.open(GrantAccessDialogComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload participants after adding new ones
        this.loadParticipants();
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
