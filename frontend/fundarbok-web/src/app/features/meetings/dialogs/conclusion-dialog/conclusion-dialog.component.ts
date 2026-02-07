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
import { Conclusion } from '../../../../models/meeting.model';

export interface ConclusionDialogData {
  conclusion?: Conclusion;
  agendaItemId: string;
  mode: 'create' | 'edit';
}

export interface ConclusionDialogResult {
  text: string;
}

@Component({
  selector: 'app-conclusion-dialog',
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
  templateUrl: './conclusion-dialog.component.html',
  styleUrl: './conclusion-dialog.component.scss'
})
export class ConclusionDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConclusionDialogComponent>,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: ConclusionDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.form = this.fb.group({
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.conclusion) {
      this.form.patchValue({
        text: this.data.conclusion.text
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
