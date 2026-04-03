import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommitteeService } from '../../../../core/services/committee.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { Committee, CommitteeMember } from '../../../../models/committee.model';
import { AddMemberDialogComponent } from '../../dialogs/add-member-dialog/add-member-dialog.component';

@Component({
  selector: 'app-committee-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslatePipe
  ],
  template: `
    <div class="committee-detail-container" *ngIf="!isLoading">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>{{ committee?.name }}</h1>
        </div>
        <button mat-button (click)="editCommittee()">
          {{ 'common.actions.edit' | translate }}
        </button>
      </div>

      <div class="content-grid">
        <mat-card class="committee-info">
          <mat-card-header>
            <h2>{{ 'committees.detail.title' | translate }}</h2>
          </mat-card-header>
          <mat-card-content>
            <p><strong>{{ 'common.ui.name' | translate }}:</strong> {{ committee?.name }}</p>
            <p *ngIf="committee?.description">
              <strong>{{ 'common.ui.description' | translate }}:</strong> {{ committee?.description }}
            </p>
          </mat-card-content>
        </mat-card>

        <mat-card class="members-card">
          <mat-card-header>
            <h2>{{ 'committees.detail.members' | translate }}</h2>
            <button mat-icon-button (click)="addMember()">
              <mat-icon>add</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let member of members" class="member-item">
                <div class="member-info">
                  <span class="member-name">{{ member.name }}</span>
                  <span class="member-role">{{ member.role }}</span>
                  <span class="member-alternate" *ngIf="member.alternateName">
                    {{ 'committees.form.alternate' | translate }}: {{ member.alternateName }}
                  </span>
                </div>
                <div class="member-actions">
                  <mat-form-field appearance="outline" class="alternate-select">
                    <mat-label>{{ 'committees.form.alternate' | translate }}</mat-label>
                    <mat-select [value]="member.alternateId || ''" (selectionChange)="onAlternateChange(member, $event.value)">
                      <mat-option value="">—</mat-option>
                      <mat-option *ngFor="let alt of getAlternateOptions(member)" [value]="alt.id">
                        {{ alt.name }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                  <button mat-icon-button (click)="removeMember(member.id)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </mat-list-item>
            </mat-list>
            <p *ngIf="members.length === 0" class="no-items">
              {{ 'committees.detail.noMembers' | translate }}
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <div class="loading" *ngIf="isLoading">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styles: [`
    .committee-detail-container {
      padding: 2rem;
      max-width: 1000px;
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
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

    .member-item {
      height: auto !important;
      padding: 0.5rem 0;
    }

    .member-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .member-name {
      font-weight: 500;
    }

    .member-role {
      font-size: 0.85rem;
      color: #666;
    }

    .member-alternate {
      font-size: 0.8rem;
      color: #ff9800;
      font-style: italic;
    }

    .member-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .alternate-select {
      width: 160px;
      font-size: 0.85rem;
    }

    ::ng-deep .alternate-select .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .no-items {
      color: #999;
      text-align: center;
      padding: 1rem;
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
export class CommitteeDetailComponent implements OnInit {
  committee: Committee | null = null;
  members: CommitteeMember[] = [];
  isLoading = true;
  private committeeId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private committeeService: CommitteeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.committeeId = params['id'];
      this.loadCommittee();
    });
  }

  loadCommittee(): void {
    this.committeeService.getCommittee(this.committeeId).subscribe({
      next: (committee) => {
        this.committee = committee;
        this.loadMembers();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadMembers(): void {
    this.committeeService.getMembers(this.committeeId).subscribe({
      next: (members) => {
        this.members = members;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  editCommittee(): void {
    this.router.navigate(['/committees', this.committeeId, 'edit']);
  }

  addMember(): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.committeeService.addMember(this.committeeId, result).subscribe({
          next: (member) => {
            this.members.push(member);
            this.snackBar.open(
              this.translationService.translate('committees.messages.memberAdded'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('errors.business.failedToAddMember'),
              this.translationService.translate('common.actions.close'),
              { duration: 5000 }
            );
          }
        });
      }
    });
  }

  getAlternateOptions(member: CommitteeMember): CommitteeMember[] {
    return this.members.filter(m => m.id !== member.id && m.isActive);
  }

  onAlternateChange(member: CommitteeMember, alternateId: string): void {
    this.committeeService.updateMember(this.committeeId, member.id, {
      name: member.name,
      title: member.title || '',
      role: member.role,
      isActive: member.isActive,
      alternateId: alternateId || undefined
    }).subscribe({
      next: (updated) => {
        member.alternateId = updated.alternateId;
        member.alternateName = updated.alternateName;
        this.snackBar.open(
          this.translationService.translate('committees.messages.committeeUpdated'),
          this.translationService.translate('common.actions.close'),
          { duration: 2000 }
        );
      }
    });
  }

  removeMember(memberId: string): void {
    this.committeeService.removeMember(this.committeeId, memberId).subscribe({
      next: () => {
        this.members = this.members.filter(m => m.id !== memberId);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/committees']);
  }
}
