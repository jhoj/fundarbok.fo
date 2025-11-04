import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MeetingService } from '../../../../core/services/meeting.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { MeetingDetail, AgendaItem } from '../../../../models/meeting.model';

@Component({
  selector: 'app-meeting-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TranslatePipe,
    HasRoleDirective
  ],
  template: `
    <div class="meeting-detail-container" *ngIf="!isLoading">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>{{ meeting?.title || meeting?.meetingNumber }}</h1>
          <p class="meeting-date">{{ meeting?.startDate | date:'medium' }}</p>
        </div>
        <div class="status-badge" [ngClass]="getStatusClass()">
          {{ getStatusLabel() }}
        </div>
      </div>

      <div class="content-grid">
        <mat-card class="meeting-info">
          <mat-card-header>
            <h2>{{ 'meetings.title' | translate }}</h2>
          </mat-card-header>
          <mat-card-content>
            <p><strong>{{ 'meetings.meetingNumber' | translate }}:</strong> {{ meeting?.meetingNumber }}</p>
            <p><strong>{{ 'meetings.meetingLocation' | translate }}:</strong> {{ meeting?.location }}</p>
            <p><strong>{{ 'meetings.startDate' | translate }}:</strong> {{ meeting?.startDate | date:'medium' }}</p>
            <p><strong>{{ 'meetings.endDate' | translate }}:</strong> {{ meeting?.endDate | date:'medium' }}</p>
            <div *ngIf="meeting?.description">
              <strong>{{ 'common.description' | translate }}:</strong>
              <p>{{ meeting?.description }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="agenda-items">
          <mat-card-header>
            <h2>{{ 'agendaItems.title' | translate }}</h2>
            <button *appHasRole="'Secretary'" mat-icon-button (click)="addAgendaItem()">
              <mat-icon>add</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let item of agendaItems; let i = index">
                <span matListItemTitle>{{ i + 1 }}. {{ item.title }}</span>
                <button mat-icon-button matListItemMeta (click)="selectAgendaItem(item)">
                  <mat-icon>edit</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
            <p *ngIf="agendaItems.length === 0" class="no-items">
              {{ 'agendaItems.title' | translate }} not added
            </p>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="agenda-detail" *ngIf="selectedAgendaItem">
        <mat-card-header>
          <h2>{{ selectedAgendaItem.title }}</h2>
        </mat-card-header>
        <mat-card-content>
          <p *ngIf="selectedAgendaItem.description">{{ selectedAgendaItem.description }}</p>

          <mat-tab-group>
            <mat-tab label="{{ 'documents.title' | translate }}">
              <div class="tab-content">
                <p>Documents section</p>
              </div>
            </mat-tab>
            <mat-tab label="{{ 'agendaItems.recommendations' | translate }}">
              <div class="tab-content">
                <p>Recommendations section</p>
              </div>
            </mat-tab>
            <mat-tab label="{{ 'agendaItems.conclusions' | translate }}">
              <div class="tab-content">
                <p>Conclusions section</p>
              </div>
            </mat-tab>
            <mat-tab label="{{ 'agendaItems.notes' | translate }}">
              <div class="tab-content">
                <p>Notes section</p>
              </div>
            </mat-tab>
            <mat-tab label="{{ 'agendaItems.tasks' | translate }}">
              <div class="tab-content">
                <p>Tasks section</p>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>

      <div class="meeting-actions" *appHasRole="'Secretary'">
        <button mat-raised-button color="accent" (click)="closeMeeting()">
          {{ 'meetings.closeMeeting' | translate }}
        </button>
        <button mat-raised-button color="primary" (click)="approveMeeting()">
          {{ 'meetings.approve' | translate }}
        </button>
      </div>
    </div>

    <div class="loading" *ngIf="isLoading">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styles: [`
    .meeting-detail-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .header-content {
      flex: 1;
    }

    .header-content h1 {
      margin: 0;
      color: #333;
    }

    .meeting-date {
      margin: 0.5rem 0 0;
      color: #999;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.9rem;
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    mat-card {
      margin-bottom: 0;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    mat-card-header h2 {
      margin: 0;
      font-size: 1.1rem;
    }

    .meeting-info p {
      margin: 0.5rem 0;
    }

    .no-items {
      color: #999;
      text-align: center;
      padding: 1rem;
    }

    .agenda-detail {
      margin-bottom: 2rem;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .meeting-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class MeetingDetailComponent implements OnInit {
  meeting: MeetingDetail | null = null;
  agendaItems: AgendaItem[] = [];
  selectedAgendaItem: AgendaItem | null = null;
  isLoading = true;
  private meetingId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.meetingId = params['id'];
      this.loadMeeting();
    });
  }

  loadMeeting(): void {
    this.isLoading = true;
    this.meetingService.getMeetingDetail(this.meetingId).subscribe({
      next: (meeting) => {
        this.meeting = meeting;
        this.agendaItems = meeting.agendaItems || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectAgendaItem(item: AgendaItem): void {
    this.selectedAgendaItem = item;
  }

  addAgendaItem(): void {
    // Navigate to add agenda item
  }

  closeMeeting(): void {
    // Implement close meeting logic
  }

  approveMeeting(): void {
    // Implement approve meeting logic
  }

  goBack(): void {
    this.router.navigate(['/meetings']);
  }

  getStatusClass(): string {
    if (!this.meeting) return '';
    if (this.meeting.isApproved) return 'approved';
    if (this.meeting.isCompleted) return 'completed';
    return 'open';
  }

  getStatusLabel(): string {
    if (!this.meeting) return '';
    if (this.meeting.isApproved) return 'Approved';
    if (this.meeting.isCompleted) return 'Completed';
    return 'Open';
  }
}
