import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { Task } from '../../../../models/meeting.model';
import { AuthService } from '../../../../core/services/auth.service';

export interface TaskDialogData {
  task?: Task;
  agendaItemId: string;
  mode: 'create' | 'edit';
  users: Array<{ id: string; name: string; email: string }>;
}

export interface TaskDialogResult {
  description: string;
  assignedUserId: string;
  dueDate?: string;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslatePipe
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  users: Array<{ id: string; name: string; email: string }> = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private translationService: TranslationService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.users = data.users || [];

    this.form = this.fb.group({
      description: ['', Validators.required],
      assignedUserId: ['', Validators.required],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.task) {
      this.form.patchValue({
        description: this.data.task.description,
        assignedUserId: this.data.task.assignedUserId,
        dueDate: this.data.task.dueDate ? new Date(this.data.task.dueDate) : null
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const result = {
        ...this.form.value,
        dueDate: this.form.value.dueDate
          ? new Date(this.form.value.dueDate).toISOString()
          : undefined
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
