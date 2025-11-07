import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MeetingService } from '../../../../core/services/meeting.service';
import { CommitteeService } from '../../../../core/services/committee.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { Meeting, Committee } from '../../../../models/meeting.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-meetings-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslatePipe,
    HasRoleDirective
  ],
  template: `
    <div class="meetings-container">
      <div class="header">
        <h1>{{ 'meetings.title' | translate }}</h1>
        <button *appHasRole="'Secretary'" mat-raised-button color="primary" (click)="createMeeting()">
          {{ 'meetings.createNew' | translate }}
        </button>
      </div>

      <mat-card class="filters-card">
        <form [formGroup]="filterForm" class="filter-form">
          <mat-form-field appearance="fill">
            <mat-label>{{ 'committees.title' | translate }}</mat-label>
            <mat-select formControlName="committeeId" (change)="applyFilters()">
              <mat-option value="">{{ 'meetings.allCommittees' | translate }}</mat-option>
              <mat-option *ngFor="let committee of committees" [value]="committee.id">
                {{ committee.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>{{ 'meetings.dateRange' | translate }} - From</mat-label>
            <input matInput [matDatepicker]="picker1" formControlName="startDate" (change)="applyFilters()">
            <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>{{ 'meetings.dateRange' | translate }} - To</mat-label>
            <input matInput [matDatepicker]="picker2" formControlName="endDate" (change)="applyFilters()">
            <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>
        </form>
      </mat-card>

      <mat-card class="meetings-table-card" *ngIf="!isLoading">
        <table mat-table [dataSource]="meetings" class="meetings-table">
          <ng-container matColumnDef="meetingNumber">
            <th mat-header-cell *matHeaderCellDef>{{ 'meetings.meetingNumber' | translate }}</th>
            <td mat-cell *matCellDef="let element">{{ element.meetingNumber }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>{{ 'meetings.title' | translate }}</th>
            <td mat-cell *matCellDef="let element">{{ element.title }}</td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>{{ 'meetings.meetingLocation' | translate }}</th>
            <td mat-cell *matCellDef="let element">{{ element.location }}</td>
          </ng-container>

          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef>{{ 'meetings.startDate' | translate }}</th>
            <td mat-cell *matCellDef="let element">{{ element.startDate | date:'short' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>{{ 'meetings.status' | translate }}</th>
            <td mat-cell *matCellDef="let element">
              <span class="status-badge" [ngClass]="getStatusClass(element)">
                {{ getStatusLabel(element) }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'common.edit' | translate }}</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button (click)="viewMeeting(element.id)">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" [routerLink]="['/meetings', row.id]" class="clickable-row"></tr>
        </table>

        <div class="empty-state" *ngIf="meetings.length === 0">
          <p>{{ 'meetings.noMeetings' | translate }}</p>
        </div>
      </mat-card>

      <div class="spinner-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .meetings-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
    }

    .filters-card {
      margin-bottom: 2rem;
      padding: 1.5rem;
    }

    .filter-form {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .meetings-table-card {
      overflow-x: auto;
    }

    .meetings-table {
      width: 100%;
    }

    .clickable-row {
      cursor: pointer;
    }

    .clickable-row:hover {
      background-color: #f5f5f5;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge.open {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.completed {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .status-badge.approved {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class MeetingsListComponent implements OnInit {
  meetings: Meeting[] = [];
  committees: Committee[] = [];
  filterForm: FormGroup;
  displayedColumns = ['meetingNumber', 'title', 'location', 'startDate', 'status', 'actions'];
  isLoading = true;

  constructor(
    private meetingService: MeetingService,
    private committeeService: CommitteeService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      committeeId: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.setDefaultWeekDateFilters();
    this.loadCommittees();
    this.loadMeetings();
  }

  private setDefaultWeekDateFilters(): void {
    const today = new Date();

    // Get first day of the week (Monday)
    const firstDayOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    firstDayOfWeek.setDate(diff);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    // Get last day of the week (Sunday)
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    // Set filter form values
    this.filterForm.patchValue({
      startDate: firstDayOfWeek,
      endDate: lastDayOfWeek
    });

    // Apply the filters
    this.applyFilters();
  }

  loadCommittees(): void {
    this.committeeService.getCommittees().subscribe({
      next: (committees) => {
        this.committees = committees;
      }
    });
  }

  loadMeetings(): void {
    this.isLoading = true;
    this.meetingService.getMeetings().subscribe({
      next: (meetings) => {
        this.meetings = meetings;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    const params: any = {};

    if (filters.committeeId) {
      params.committeeId = filters.committeeId;
    }
    if (filters.startDate) {
      params.startDate = new Date(filters.startDate).toISOString();
    }
    if (filters.endDate) {
      params.endDate = new Date(filters.endDate).toISOString();
    }

    this.isLoading = true;
    this.meetingService.getMeetings(params).subscribe({
      next: (meetings) => {
        this.meetings = meetings;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  createMeeting(): void {
    this.router.navigate(['/meetings/new']);
  }

  viewMeeting(id: string): void {
    this.router.navigate(['/meetings', id]);
  }

  getStatusClass(meeting: Meeting): string {
    if (meeting.isApproved) return 'approved';
    if (meeting.isCompleted) return 'completed';
    return 'open';
  }

  getStatusLabel(meeting: Meeting): string {
    if (meeting.isApproved) return 'Approved';
    if (meeting.isCompleted) return 'Completed';
    return 'Open';
  }
}
