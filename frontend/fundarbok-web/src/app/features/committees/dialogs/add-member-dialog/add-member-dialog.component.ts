import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    TranslatePipe
  ],
  template: `
    <h2 mat-dialog-title>{{ 'committees.dialog.addMember' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="memberForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>{{ 'committees.form.memberName' | translate }}</mat-label>
          <input matInput formControlName="name" required>
          <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>{{ 'committees.form.memberRole' | translate }}</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="Chairman">{{ 'committees.roles.chairman' | translate }}</mat-option>
            <mat-option value="Vice Chairman">{{ 'committees.roles.viceChairman' | translate }}</mat-option>
            <mat-option value="Member">{{ 'committees.roles.member' | translate }}</mat-option>
            <mat-option value="Secretary">{{ 'committees.roles.secretary' | translate }}</mat-option>
          </mat-select>
          <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>{{ 'committees.form.memberTitle' | translate }}</mat-label>
          <input matInput formControlName="title">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'common.actions.cancel' | translate }}</button>
      <button mat-raised-button color="primary" [disabled]="!memberForm.valid" (click)="onSave()">
        {{ 'common.actions.save' | translate }}
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

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class AddMemberDialogComponent {
  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      role: ['Member', Validators.required],
      title: ['']
    });
  }

  onSave(): void {
    if (this.memberForm.valid) {
      this.dialogRef.close(this.memberForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
