import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MeetingService } from '../meetings/services/meeting.service';
import { CommitteeService } from '../../core/services/committee.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Meeting } from '../../models/meeting.model';
import { Committee } from '../../models/committee.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  template: `
    <div class="dashboard-container">
      <h1>{{ 'navigation.dashboard' | translate }}</h1>

      <div class="dashboard-grid">
        <mat-card class="stat-card" routerLink="/meetings">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ upcomingMeetingsCount }}</h3>
              <p>{{ 'meetings.title' | translate }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card" routerLink="/committees">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>group</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ committeesCount }}</h3>
              <p>{{ 'committees.title' | translate }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="recent-meetings" *ngIf="!isLoading">
        <h2>{{ 'meetings.title' | translate }}</h2>
        <div class="empty-state" *ngIf="recentMeetings.length === 0">
          <p>{{ 'meetings.list.noMeetings' | translate }}</p>
          <button mat-raised-button color="primary" (click)="navigateToMeetings()">
            {{ 'meetings.list.createNew' | translate }}
          </button>
        </div>

        <div class="meetings-list" *ngIf="recentMeetings.length > 0">
          <mat-card *ngFor="let meeting of recentMeetings" class="meeting-card" [routerLink]="['/meetings', meeting.id]">
            <mat-card-header>
              <div class="card-header-content">
                <div class="title-row">
                  <h3>{{ meeting.title || ('meetings.detail.meetingNumberLabel' | translate) + ' ' + meeting.meetingNumber }}</h3>
                  <span class="status-badge" [class]="getMeetingStatus(meeting)">
                    {{ getMeetingStatusText(meeting) | translate }}
                  </span>
                </div>
                <span class="committee-name">{{ getCommitteeName(meeting.committeeId) }}</span>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="meeting-details">
                <div class="detail-item">
                  <mat-icon>event</mat-icon>
                  <span>{{ meeting.startDate | date:'short' }}</span>
                </div>
                <div class="detail-item" *ngIf="meeting.location">
                  <mat-icon>location_on</mat-icon>
                  <span>{{ meeting.location }}</span>
                </div>
                <p class="description" *ngIf="meeting.description">{{ meeting.description }}</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
    }

    h2 {
      margin: 2rem 0 1.5rem;
      color: #666;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    mat-card-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      font-size: 3rem;
      color: #667eea;
    }

    .stat-icon mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .stat-info p {
      margin: 0.25rem 0 0;
      color: #999;
      font-size: 0.9rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #f5f5f5;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .meetings-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .meeting-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .meeting-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    mat-card-header {
      margin-bottom: 1rem;
    }

    .card-header-content {
      width: 100%;
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .title-row h3 {
      margin: 0;
      flex: 1;
      font-size: 1.1rem;
      color: #333;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .status-badge.approved {
      background-color: #4caf50;
      color: white;
    }

    .status-badge.completed {
      background-color: #2196f3;
      color: white;
    }

    .status-badge.open {
      background-color: #ff9800;
      color: white;
    }

    .status-badge.draft {
      background-color: #9e9e9e;
      color: white;
    }

    .committee-name {
      font-size: 0.85rem;
      color: #667eea;
      font-weight: 500;
    }

    .meeting-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .detail-item mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
      color: #999;
    }

    .description {
      margin-top: 0.5rem;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  `]
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  upcomingMeetingsCount = 0;
  committeesCount = 0;
  recentMeetings: Meeting[] = [];
  committees: Committee[] = [];

  constructor(
    private meetingService: MeetingService,
    private committeeService: CommitteeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.committeeService.getCommittees().subscribe({
      next: (committees) => {
        this.committees = committees;
        this.committeesCount = committees.length;
      }
    });

    // Filter for upcoming meetings: startDate >= today and not completed
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    const filters = {
      startDate: today.toISOString(),
      isCompleted: false
    };

    this.meetingService.getMeetings(filters).subscribe({
      next: (meetings) => {
        // Sort by startDate ascending (earliest first)
        const sortedMeetings = meetings.sort((a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        this.recentMeetings = sortedMeetings.slice(0, 6);
        this.upcomingMeetingsCount = sortedMeetings.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getCommitteeName(committeeId: string): string {
    const committee = this.committees.find(c => c.id === committeeId);
    return committee?.name || '';
  }

  getMeetingStatus(meeting: Meeting): string {
    if (meeting.isApproved) return 'approved';
    if (meeting.isCompleted) return 'completed';
    if (meeting.isOpen) return 'open';
    return 'draft';
  }

  getMeetingStatusText(meeting: Meeting): string {
    const status = this.getMeetingStatus(meeting);
    return `meetings.status.${status}`;
  }

  navigateToMeetings(): void {
    this.router.navigate(['/meetings/new']);
  }

  navigateToMeeting(id: string): void {
    this.router.navigate(['/meetings', id]);
  }
}
