import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommitteeService } from '../../../core/services/committee.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Committee } from '../../../models/committee.model';

@Component({
  selector: 'app-committee-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  template: `
    <h2 mat-dialog-title>{{ 'committees.createNew' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="committeeForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>{{ 'committees.name' | translate }}</mat-label>
          <input matInput formControlName="name" required autofocus>
          <mat-error>{{ 'errors.required' | translate }}</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>{{ 'common.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'common.cancel' | translate }}</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onCreate()"
        [disabled]="!committeeForm.valid || isLoading()"
      >
        <span *ngIf="!isLoading()">{{ 'common.create' | translate }}</span>
        <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    mat-dialog-content {
      min-width: 400px;
      padding-top: 1rem;
    }
  `]
})
export class CommitteeCreateDialogComponent {
  committeeForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private committeeService: CommitteeService,
    private dialogRef: MatDialogRef<CommitteeCreateDialogComponent>
  ) {
    this.committeeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onCreate(): void {
    if (this.committeeForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.committeeService.createCommittee(this.committeeForm.value).subscribe({
      next: (committee: Committee) => {
        this.isLoading.set(false);
        this.dialogRef.close(committee); // Return the created committee
      },
      error: () => {
        this.isLoading.set(false);
        // Error handling could be improved with snackbar
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
