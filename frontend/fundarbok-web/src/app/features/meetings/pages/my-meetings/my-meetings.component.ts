import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { MeetingService } from '../../services/meeting.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Meeting, MeetingDetail } from '../../../../models/meeting.model';

type FilterType = 'all' | 'upcoming' | 'past';

@Component({
  selector: 'app-my-meetings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './my-meetings.component.html',
  styleUrls: ['./my-meetings.component.scss']
})
export class MyMeetingsComponent implements OnInit {
  meetings: MeetingDetail[] = [];
  filteredMeetings: MeetingDetail[] = [];
  isLoading = true;
  currentFilter: FilterType = 'all';
  displayedColumns: string[] = ['committee', 'date', 'location', 'status', 'actions'];

  constructor(
    private meetingService: MeetingService,
    private authService: AuthService,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyMeetings();
  }

  loadMyMeetings(): void {
    this.isLoading = true;
    // Get all meetings and filter by participant status
    this.meetingService.getMeetings().subscribe({
      next: (meetings: any[]) => {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          // Filter meetings where user is a participant
          this.meetings = meetings.filter((meeting: any) =>
            meeting.participants?.some((p: any) => p.committeeMember?.id === currentUser.id) ||
            meeting.participants?.some((p: any) => p.committeeMemberId === currentUser.id)
          );
        } else {
          this.meetings = [];
        }
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.meetings = [];
      }
    });
  }

  applyFilter(): void {
    const now = new Date();

    switch (this.currentFilter) {
      case 'upcoming':
        this.filteredMeetings = this.meetings.filter(m =>
          new Date(m.startDate) >= now
        );
        break;
      case 'past':
        this.filteredMeetings = this.meetings.filter(m =>
          new Date(m.startDate) < now
        );
        break;
      default:
        this.filteredMeetings = [...this.meetings];
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  viewMeeting(meeting: any): void {
    this.router.navigate(['/meetings', meeting.id]);
  }

  getStatusBadgeClass(meeting: any): string {
    if (meeting.isApproved) return 'status-approved';
    if (meeting.isCompleted) return 'status-completed';
    return 'status-open';
  }

  getStatusLabel(meeting: any): string {
    if (meeting.isApproved) return this.translationService.translate('meetings.status.approved');
    if (meeting.isCompleted) return this.translationService.translate('meetings.status.completed');
    return this.translationService.translate('meetings.status.open');
  }

  getCommitteeName(meeting: any): string {
    return meeting.committee?.name || 'Unknown Committee';
  }

  hasNoMeetings(): boolean {
    return this.filteredMeetings.length === 0 && !this.isLoading;
  }
}
