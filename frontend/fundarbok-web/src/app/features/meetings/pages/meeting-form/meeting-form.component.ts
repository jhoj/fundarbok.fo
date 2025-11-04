import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MeetingService } from '../../../../core/services/meeting.service';
import { CommitteeService } from '../../../../core/services/committee.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Committee } from '../../../../models/committee.model';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-meeting-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <h1>{{ isEditMode ? 'Edit Meeting' : 'Create New Meeting' }}</h1>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="meetingForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'committees.title' | translate }}</mat-label>
              <mat-select formControlName="committeeId" required>
                <mat-option *ngFor="let committee of committees" [value]="committee.id">
                  {{ committee.name }}
                </mat-option>
              </mat-select>
              <mat-error>{{ 'errors.required' | translate }}</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'meetings.title' | translate }}</mat-label>
              <input matInput formControlName="title">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'meetings.meetingLocation' | translate }}</mat-label>
              <input matInput formControlName="location" required>
              <mat-error>{{ 'errors.required' | translate }}</mat-error>
            </mat-form-field>

            <div class="date-time-group">
              <mat-form-field appearance="fill" class="half-width">
                <mat-label>{{ 'meetings.startDate' | translate }}</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
                <mat-error>{{ 'errors.required' | translate }}</mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="half-width">
                <mat-label>{{ 'meetings.endDate' | translate }}</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
                <mat-error>{{ 'errors.required' | translate }}</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'common.description' | translate }}</mat-label>
              <textarea matInput formControlName="description" rows="4"></textarea>
            </mat-form-field>

            <div class="button-group">
              <button mat-raised-button type="button" (click)="goBack()">
                {{ 'common.cancel' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!meetingForm.valid || isLoading()"
              >
                <span *ngIf="!isLoading()">{{ 'common.save' | translate }}</span>
                <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 2rem;
      max-width: 700px;
      margin: 0 auto;
    }

    mat-card {
      padding: 2rem;
    }

    mat-card-header {
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .date-time-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .half-width {
      width: 100%;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 600px) {
      .date-time-group {
        grid-template-columns: 1fr;
      }

      .button-group {
        flex-direction: column;
      }
    }
  `]
})
export class MeetingFormComponent implements OnInit {
  meetingForm: FormGroup;
  committees: Committee[] = [];
  isLoading = signal(false);
  isEditMode = false;
  private meetingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private committeeService: CommitteeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.meetingForm = this.fb.group({
      committeeId: ['', Validators.required],
      title: [''],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCommittees();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.meetingId = params['id'];
        this.loadMeeting();
      }
    });
  }

  loadCommittees(): void {
    this.committeeService.getCommittees().subscribe({
      next: (committees) => {
        this.committees = committees;
      }
    });
  }

  loadMeeting(): void {
    if (!this.meetingId) return;

    this.isLoading.set(true);
    this.meetingService.getMeeting(this.meetingId).subscribe({
      next: (meeting) => {
        this.meetingForm.patchValue({
          committeeId: meeting.committeeId,
          title: meeting.title,
          location: meeting.location,
          startDate: new Date(meeting.startDate),
          endDate: new Date(meeting.endDate),
          description: meeting.description
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load meeting', 'Close', { duration: 5000 });
      }
    });
  }

  onSubmit(): void {
    if (this.meetingForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const formData = {
      ...this.meetingForm.value,
      startDate: new Date(this.meetingForm.value.startDate).toISOString(),
      endDate: new Date(this.meetingForm.value.endDate).toISOString()
    };

    const request$ = this.isEditMode && this.meetingId
      ? this.meetingService.updateMeeting(this.meetingId, formData)
      : this.meetingService.createMeeting(formData);

    request$.subscribe({
      next: (meeting) => {
        this.isLoading.set(false);
        const message = this.isEditMode ? 'Meeting updated' : 'Meeting created';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.router.navigate(['/meetings', meeting.id]);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Failed to save meeting';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/meetings']);
  }
}
