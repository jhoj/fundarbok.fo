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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MeetingService } from '../../../../core/services/meeting.service';
import { CommitteeService } from '../../../../core/services/committee.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { Committee } from '../../../../models/committee.model';
import { CommitteeCreateDialogComponent } from '../../dialogs/committee-create-dialog.component';

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
    MatDialogModule,
    MatIconModule,
    TranslatePipe
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <h1>{{ (isEditMode ? 'meetings.form.editMeeting' : 'meetings.form.createNewMeeting') | translate }}</h1>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="meetingForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'committees.title' | translate }}</mat-label>
              <mat-select formControlName="committeeId" required>
                <mat-option value="__new__" class="create-new-option">
                  <mat-icon>add</mat-icon>
                  <span>{{ 'committees.createNew' | translate }}</span>
                </mat-option>
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

            <!-- Desktop: Material Date Pickers + Time Dropdowns -->
            <div class="date-time-group desktop-datetime">
              <!-- Start Date and Time -->
              <div class="date-time-section">
                <mat-form-field appearance="fill" class="full-width">
                  <mat-label>{{ 'meetings.form.startDate' | translate }}</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                  <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
                </mat-form-field>

                <div class="time-input-group">
                  <mat-form-field appearance="fill" class="time-field">
                    <mat-label>{{ 'common.time.hours' | translate }}</mat-label>
                    <mat-select formControlName="startHours" required>
                      <mat-option *ngFor="let hour of hours" [value]="hour">
                        {{hour.toString().padStart(2, '0')}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <span class="time-separator">:</span>

                  <mat-form-field appearance="fill" class="time-field">
                    <mat-label>{{ 'common.time.minutes' | translate }}</mat-label>
                    <mat-select formControlName="startMinutes" required>
                      <mat-option *ngFor="let minute of minutes" [value]="minute">
                        {{minute.toString().padStart(2, '0')}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>

              <!-- End Date and Time -->
              <div class="date-time-section">
                <mat-form-field appearance="fill" class="full-width">
                  <mat-label>{{ 'meetings.form.endDate' | translate }}</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                  <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
                </mat-form-field>

                <div class="time-input-group">
                  <mat-form-field appearance="fill" class="time-field">
                    <mat-label>{{ 'common.time.hours' | translate }}</mat-label>
                    <mat-select formControlName="endHours" required>
                      <mat-option *ngFor="let hour of hours" [value]="hour">
                        {{hour.toString().padStart(2, '0')}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <span class="time-separator">:</span>

                  <mat-form-field appearance="fill" class="time-field">
                    <mat-label>{{ 'common.time.minutes' | translate }}</mat-label>
                    <mat-select formControlName="endMinutes" required>
                      <mat-option *ngFor="let minute of minutes" [value]="minute">
                        {{minute.toString().padStart(2, '0')}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>
            </div>

            <!-- Mobile: Native DateTime Inputs -->
            <div class="mobile-datetime">
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>{{ 'meetings.form.startDateTime' | translate }}</mat-label>
                <input matInput type="datetime-local" formControlName="startDateTime" required>
                <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="full-width">
                <mat-label>{{ 'meetings.form.endDateTime' | translate }}</mat-label>
                <input matInput type="datetime-local" formControlName="endDateTime" required>
                <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
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

    /* Desktop DateTime Layout */
    .desktop-datetime {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .date-time-input {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .time-input-group {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .time-field {
      flex: 1;
      min-width: 0;
    }

    .time-separator {
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: #666;
      line-height: 1;
    }

    /* Mobile DateTime - Hidden by default */
    .mobile-datetime {
      display: none;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .create-new-option {
      color: #667eea;
      font-weight: 500;
    }

    .create-new-option mat-icon {
      vertical-align: middle;
      margin-right: 8px;
    }

    /* Tablet breakpoint */
    @media (max-width: 768px) {
      .desktop-datetime {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    /* Mobile breakpoint - Switch to native datetime inputs */
    @media (max-width: 600px) {
      .form-container {
        padding: 1rem;
      }

      mat-card {
        padding: 1rem;
      }

      /* Hide desktop datetime controls */
      .desktop-datetime {
        display: none;
      }

      /* Show mobile datetime controls */
      .mobile-datetime {
        display: block;
      }

      .button-group {
        flex-direction: column;
      }

      .button-group button {
        width: 100%;
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

  // Time picker options
  hours = Array.from({ length: 24 }, (_, i) => i);
  minutes = Array.from({ length: 60 }, (_, i) => i);

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private committeeService: CommitteeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private translationService: TranslationService
  ) {
    this.meetingForm = this.fb.group({
      committeeId: ['', Validators.required],
      title: [''],
      location: ['', Validators.required],
      // Desktop controls
      startDate: ['', Validators.required],
      startHours: [9, Validators.required], // Default to 9 AM
      startMinutes: [0, Validators.required],
      endDate: ['', Validators.required],
      endHours: [17, Validators.required], // Default to 5 PM
      endMinutes: [0, Validators.required],
      // Mobile controls
      startDateTime: [''],
      endDateTime: [''],
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

    // Listen for committee selection changes
    this.meetingForm.get('committeeId')?.valueChanges.subscribe(value => {
      if (value === '__new__') {
        this.openCommitteeDialog();
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
        const startDate = new Date(meeting.startDate);
        const endDate = new Date(meeting.endDate);

        // Format for datetime-local input (YYYY-MM-DDTHH:mm)
        const formatDateTimeLocal = (date: Date): string => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        this.meetingForm.patchValue({
          committeeId: meeting.committeeId,
          title: meeting.title,
          location: meeting.location,
          // Desktop controls
          startDate: startDate,
          startHours: startDate.getHours(),
          startMinutes: startDate.getMinutes(),
          endDate: endDate,
          endHours: endDate.getHours(),
          endMinutes: endDate.getMinutes(),
          // Mobile controls
          startDateTime: formatDateTimeLocal(startDate),
          endDateTime: formatDateTimeLocal(endDate),
          description: meeting.description
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open(
          this.translationService.translate('meetings.messages.failedToLoad'),
          this.translationService.translate('common.actions.close'),
          { duration: 5000 }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.meetingForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const formValue = this.meetingForm.value;

    let startDateTime: Date;
    let endDateTime: Date;

    // Check if mobile datetime inputs have values (mobile view)
    if (formValue.startDateTime && formValue.endDateTime) {
      startDateTime = new Date(formValue.startDateTime);
      endDateTime = new Date(formValue.endDateTime);
    } else {
      // Use desktop date/time inputs
      startDateTime = new Date(formValue.startDate);
      startDateTime.setHours(formValue.startHours, formValue.startMinutes);

      endDateTime = new Date(formValue.endDate);
      endDateTime.setHours(formValue.endHours, formValue.endMinutes);
    }

    const formData = {
      committeeId: formValue.committeeId,
      title: formValue.title,
      location: formValue.location,
      description: formValue.description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString()
    };

    const request$ = this.isEditMode && this.meetingId
      ? this.meetingService.updateMeeting(this.meetingId, formData)
      : this.meetingService.createMeeting(formData);

    request$.subscribe({
      next: (meeting) => {
        this.isLoading.set(false);
        const message = this.isEditMode
          ? this.translationService.translate('meetings.messages.meetingUpdated')
          : this.translationService.translate('meetings.messages.meetingCreated');
        this.snackBar.open(message, this.translationService.translate('common.actions.close'), { duration: 3000 });
        this.router.navigate(['/meetings', meeting.id]);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || this.translationService.translate('notifications.error.failedToSave');
        this.snackBar.open(message, this.translationService.translate('common.actions.close'), { duration: 5000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/meetings']);
  }

  openCommitteeDialog(): void {
    const dialogRef = this.dialog.open(CommitteeCreateDialogComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result: Committee | undefined) => {
      if (result) {
        // Add the new committee to the list
        this.committees = [...this.committees, result];
        // Select the newly created committee
        this.meetingForm.patchValue({ committeeId: result.id });
        this.snackBar.open(
          this.translationService.translate('committees.messages.committeeCreated'),
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
      } else {
        // User cancelled - reset to empty selection
        this.meetingForm.patchValue({ committeeId: '' });
      }
    });
  }
}
