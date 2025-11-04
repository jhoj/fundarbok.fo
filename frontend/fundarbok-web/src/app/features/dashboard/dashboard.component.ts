import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MeetingService } from '../../core/services/meeting.service';
import { CommitteeService } from '../../core/services/committee.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Meeting, Committee } from '../../models/meeting.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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
        <mat-card class="stat-card">
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

        <mat-card class="stat-card">
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
          <p>{{ 'meetings.noMeetings' | translate }}</p>
          <button mat-raised-button color="primary" (click)="navigateToMeetings()">
            {{ 'meetings.createNew' | translate }}
          </button>
        </div>

        <div class="meetings-list" *ngIf="recentMeetings.length > 0">
          <mat-card *ngFor="let meeting of recentMeetings" class="meeting-card">
            <mat-card-header>
              <h3>{{ meeting.title || meeting.meetingNumber }}</h3>
              <span class="meeting-date">{{ meeting.startDate | date:'short' }}</span>
            </mat-card-header>
            <mat-card-content>
              <p>{{ meeting.location }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button (click)="navigateToMeeting(meeting.id)">
                {{ 'common.edit' | translate }}
              </button>
            </mat-card-actions>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .meeting-date {
      font-size: 0.85rem;
      color: #999;
    }
  `]
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  upcomingMeetingsCount = 0;
  committeesCount = 0;
  recentMeetings: Meeting[] = [];

  constructor(
    private meetingService: MeetingService,
    private committeeService: CommitteeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.meetingService.getMeetings().subscribe({
      next: (meetings) => {
        this.recentMeetings = meetings.slice(0, 6);
        this.upcomingMeetingsCount = meetings.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.committeeService.getCommittees().subscribe({
      next: (committees) => {
        this.committeesCount = committees.length;
      }
    });
  }

  navigateToMeetings(): void {
    this.router.navigate(['/meetings']);
  }

  navigateToMeeting(id: string): void {
    this.router.navigate(['/meetings', id]);
  }
}
