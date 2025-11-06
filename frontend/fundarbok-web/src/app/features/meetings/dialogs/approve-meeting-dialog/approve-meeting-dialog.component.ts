import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { MeetingDetail } from '../../../../models/meeting.model';

export interface ApproveMeetingDialogData {
  meeting: MeetingDetail;
}

@Component({
  selector: 'app-approve-meeting-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatListModule,
    MatRadioModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './approve-meeting-dialog.component.html',
  styleUrls: ['./approve-meeting-dialog.component.scss']
})
export class ApproveMeetingDialogComponent {
  meeting: MeetingDetail;
  validationMessage: string = '';
  notifyParticipants: boolean = true;
  confirmationAnswer: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ApproveMeetingDialogData,
    private dialogRef: MatDialogRef<ApproveMeetingDialogComponent>,
    private translationService: TranslationService
  ) {
    this.meeting = data.meeting;
    this.validateMeeting();
  }

  validateMeeting(): void {
    // Check if meeting is completed (closed)
    if (!this.meeting.isCompleted) {
      this.validationMessage = this.translationService.translate(
        'meetings.workflows.approve.mustBeClosed'
      );
      return;
    }

    // Check if all agenda items have at least one conclusion
    const itemsWithoutConclusions = this.meeting.agendaItems.filter(
      item => !item.conclusions || item.conclusions.length === 0
    );

    if (itemsWithoutConclusions.length > 0) {
      this.validationMessage = this.translationService.translate(
        'meetings.workflows.approve.validationError'
      );
    }
  }

  isValid(): boolean {
    return this.validationMessage === '' && this.confirmationAnswer === 'yes';
  }

  onConfirm(): void {
    if (this.isValid()) {
      this.dialogRef.close({
        confirm: true,
        notifyParticipants: this.notifyParticipants
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getItemsWithoutConclusions(): any[] {
    return this.meeting.agendaItems.filter(
      item => !item.conclusions || item.conclusions.length === 0
    );
  }
}
