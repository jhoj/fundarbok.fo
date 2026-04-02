import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { CommitteeMember } from '../../../../models/committee.model';
import { CommitteeService } from '../../../../core/services/committee.service';
import { MeetingService } from '../../../../core/services/meeting.service';

export interface GrantAccessDialogData {
  meetingId: string;
  committeeId: string;
}

interface SelectableCommitteeMember extends CommitteeMember {
  selected: boolean;
  alreadyParticipant: boolean;
}

@Component({
  selector: 'app-grant-access-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './grant-access-dialog.component.html',
  styleUrl: './grant-access-dialog.component.scss'
})
export class GrantAccessDialogComponent implements OnInit {
  members: SelectableCommitteeMember[] = [];
  loading = true;
  saving = false;

  constructor(
    private dialogRef: MatDialogRef<GrantAccessDialogComponent>,
    private committeeService: CommitteeService,
    private meetingService: MeetingService,
    private translationService: TranslationService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: GrantAccessDialogData
  ) {}

  ngOnInit(): void {
    this.loadCommitteeMembers();
  }

  loadCommitteeMembers(): void {
    this.loading = true;

    // Load committee members and existing participants
    Promise.all([
      this.committeeService.getMembers(this.data.committeeId).toPromise(),
      this.meetingService.getMeetingById(this.data.meetingId).toPromise()
    ]).then(([members, meeting]) => {
      const existingParticipantIds = new Set(
        meeting?.participants?.map((p: any) => p.committeeMemberId) || []
      );

      this.members = (members || []).map((member: CommitteeMember) => ({
        ...member,
        selected: existingParticipantIds.has(member.id),
        alreadyParticipant: existingParticipantIds.has(member.id)
      }));

      this.loading = false;
    }).catch(() => {
      this.snackBar.open('Failed to load committee members', 'Close', { duration: 3000 });
      this.loading = false;
    });
  }

  onSave(): void {
    const selectedMembers = this.members.filter(m => m.selected && !m.alreadyParticipant);

    if (selectedMembers.length === 0) {
      this.snackBar.open('No new members selected', 'Close', { duration: 2000 });
      return;
    }

    this.saving = true;

    // Add each selected member as a participant
    const addPromises = selectedMembers.map(member =>
      this.meetingService.addParticipant(this.data.meetingId, {
        committeeMemberId: member.id,
        isParticipating: true
      }).toPromise()
    );

    Promise.all(addPromises).then(() => {
      this.snackBar.open(
        this.translationService.translate('meetings.participants.participantAdded'),
        'Close',
        { duration: 2000 }
      );
      this.dialogRef.close(true);
    }).catch(() => {
      this.snackBar.open('Failed to add participants', 'Close', { duration: 3000 });
      this.saving = false;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get hasSelections(): boolean {
    return this.members.some(m => m.selected && !m.alreadyParticipant);
  }
}
