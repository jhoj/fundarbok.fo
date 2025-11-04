import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CommitteeService } from '../../../../core/services/committee.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Committee } from '../../../../models/committee.model';

@Component({
  selector: 'app-committees-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  template: `
    <div class="committees-container">
      <div class="header">
        <h1>{{ 'committees.title' | translate }}</h1>
        <button mat-raised-button color="primary" (click)="createCommittee()">
          {{ 'committees.createNew' | translate }}
        </button>
      </div>

      <mat-card class="committees-table-card" *ngIf="!isLoading">
        <table mat-table [dataSource]="committees">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>{{ 'committees.name' | translate }}</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>{{ 'common.description' | translate }}</th>
            <td mat-cell *matCellDef="let element">{{ element.description || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'common.edit' | translate }}</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button (click)="viewCommittee(element.id)">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" [routerLink]="['/committees', row.id]" class="clickable-row"></tr>
        </table>

        <div class="empty-state" *ngIf="committees.length === 0">
          <p>{{ 'committees.noCommittees' | translate }}</p>
        </div>
      </mat-card>

      <div class="spinner-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .committees-container {
      padding: 2rem;
      max-width: 1000px;
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

    .committees-table-card {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    .clickable-row {
      cursor: pointer;
    }

    .clickable-row:hover {
      background-color: #f5f5f5;
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
export class CommitteesListComponent implements OnInit {
  committees: Committee[] = [];
  displayedColumns = ['name', 'description', 'actions'];
  isLoading = true;

  constructor(
    private committeeService: CommitteeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCommittees();
  }

  loadCommittees(): void {
    this.committeeService.getCommittees().subscribe({
      next: (committees) => {
        this.committees = committees;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  createCommittee(): void {
    this.router.navigate(['/committees/new']);
  }

  viewCommittee(id: string): void {
    this.router.navigate(['/committees', id]);
  }
}
