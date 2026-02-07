import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { MeetingDetail } from '../../../../models/meeting.model';

export interface CloseMeetingDialogData {
  meeting: MeetingDetail;
}

@Component({
  selector: 'app-close-meeting-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    TranslatePipe
  ],
  templateUrl: './close-meeting-dialog.component.html',
  styleUrls: ['./close-meeting-dialog.component.scss']
})
export class CloseMeetingDialogComponent {
  meeting: MeetingDetail;
  validationMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CloseMeetingDialogData,
    private dialogRef: MatDialogRef<CloseMeetingDialogComponent>,
    private translationService: TranslationService
  ) {
    this.meeting = data.meeting;
    this.validateMeeting();
  }

  validateMeeting(): void {
    // Check if all agenda items have at least one conclusion
    const itemsWithoutConclusions = this.meeting.agendaItems.filter(
      item => !item.conclusions || item.conclusions.length === 0
    );

    if (itemsWithoutConclusions.length > 0) {
      this.validationMessage = this.translationService.translate(
        'meetings.workflows.close.validationError'
      );
    }
  }

  isValid(): boolean {
    return this.validationMessage === '';
  }

  onConfirm(): void {
    if (this.isValid()) {
      this.dialogRef.close(true);
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
