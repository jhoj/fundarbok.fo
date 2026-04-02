import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MeetingService, MeetingFilter } from '../../../core/services/meeting.service';
import { CommitteeService } from '../../../core/services/committee.service';
import { Meeting } from '../../../models/meeting.model';
import { Committee } from '../../../models/committee.model';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrls: ['./meetings-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HasRoleDirective,
    TranslatePipe
  ],
  standalone: true
})
export class MeetingsListComponent implements OnInit {
  meetings: Meeting[] = [];
  committees: Committee[] = [];
  isLoading = false;

  // Filter values
  selectedCommitteeId: string | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Table columns
  displayedColumns: string[] = [
    'committeeName',
    'meetingNumber',
    'nextMeeting',
    'approvedDate',
    'description',
    'isApproved'
  ];

  constructor(
    private meetingService: MeetingService,
    private committeeService: CommitteeService,
    private router: Router
  ) {
    // Set default date range
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), 0, 1); // Start of year
    this.endDate = now;
  }

  ngOnInit(): void {
    this.loadCommittees();
    this.loadMeetings();
  }

  loadCommittees(): void {
    this.committeeService.getCommittees().subscribe({
      next: (committees) => {
        this.committees = committees;
      },
      error: (error) => {
        console.error('Error loading committees:', error);
      }
    });
  }

  loadMeetings(): void {
    this.isLoading = true;

    const filters: MeetingFilter = {};

    if (this.selectedCommitteeId) {
      filters.committeeId = this.selectedCommitteeId;
    }
    if (this.startDate) {
      // Set to start of day (00:00:00)
      const startOfDay = new Date(this.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      filters.startDate = startOfDay.toISOString();
    }
    if (this.endDate) {
      // Set to end of day (23:59:59.999)
      const endOfDay = new Date(this.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filters.endDate = endOfDay.toISOString();
    }

    this.meetingService.getMeetings(filters).subscribe({
      next: (meetings) => {
        this.meetings = meetings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading meetings:', error);
        this.isLoading = false;
      }
    });
  }

  onCommitteeChange(committeeId: string | null): void {
    this.selectedCommitteeId = committeeId;
    this.loadMeetings();
  }

  onDateRangeChange(): void {
    this.loadMeetings();
  }

  onRowClick(meeting: Meeting): void {
    this.router.navigate(['/meetings', meeting.id]);
  }

  navigateToCreateMeeting(): void {
    this.router.navigate(['/meetings/new']);
  }

  getCommitteeName(committeeId: string): string {
    const committee = this.committees.find(c => c.id === committeeId);
    return committee?.name || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} - ${hours}:${minutes}`;
  }

  formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  getApprovedStatusText(meeting: Meeting): string {
    // Use localized yes/no based on language
    return meeting.isApproved ? 'Ja' : 'Nei';
  }

  isApprovedClass(meeting: Meeting): string {
    return meeting.isApproved ? 'approved' : 'not-approved';
  }
}
