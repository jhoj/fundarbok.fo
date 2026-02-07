import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { AgendaItemDetail } from '../../../../models/meeting.model';

export interface AgendaItemDialogData {
  agendaItem?: AgendaItemDetail;
  meetingId: string;
  mode: 'create' | 'edit';
}

export interface AgendaItemDialogResult {
  title: string;
  description?: string;
}

@Component({
  selector: 'app-agenda-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './agenda-item-dialog.component.html',
  styleUrl: './agenda-item-dialog.component.scss'
})
export class AgendaItemDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgendaItemDialogComponent>,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: AgendaItemDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.agendaItem) {
      this.form.patchValue({
        title: this.data.agendaItem.title,
        description: this.data.agendaItem.description || ''
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const result: AgendaItemDialogResult = {
        title: this.form.value.title,
        description: this.form.value.description || undefined
      };
      this.dialogRef.close(result);
    }
  }

  getDialogTitle(): string {
    return this.isEditMode
      ? this.translationService.translate('agendaItems.editItem')
      : this.translationService.translate('agendaItems.addItem');
  }
}
