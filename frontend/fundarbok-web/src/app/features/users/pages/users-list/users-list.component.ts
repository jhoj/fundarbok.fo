import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { UserService, UserListDto } from '../../../../core/services/user.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TranslatePipe,
    RouterModule
  ],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>{{ 'users.title' | translate }}</h1>
        <button mat-raised-button color="primary" (click)="createUser()">
          {{ 'users.list.createNew' | translate }}
        </button>
      </div>

      <mat-card class="users-table-card" *ngIf="!isLoading">
        <table mat-table [dataSource]="users">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>{{ 'common.ui.name' | translate }}</th>
            <td mat-cell *matCellDef="let u">
              {{ u.name }}
              <mat-icon *ngIf="!u.isActive" class="inactive-icon">block</mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>{{ 'users.fields.email' | translate }}</th>
            <td mat-cell *matCellDef="let u">{{ u.email }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>{{ 'users.fields.role' | translate }}</th>
            <td mat-cell *matCellDef="let u">
              <mat-chip [class]="u.role === 'Secretary' ? 'role-secretary' : 'role-member'">
                {{ ('users.roles.' + u.role) | translate }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="committeeMember">
            <th mat-header-cell *matHeaderCellDef>{{ 'users.fields.committeeMember' | translate }}</th>
            <td mat-cell *matCellDef="let u">{{ u.committeeMemberName || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let u">
              <button mat-icon-button (click)="editUser(u.id); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              [class.inactive-row]="!row.isActive"
              (click)="editUser(row.id)"
              class="clickable-row"></tr>
        </table>

        <div class="empty-state" *ngIf="users.length === 0">
          <p>{{ 'users.list.noUsers' | translate }}</p>
        </div>
      </mat-card>

      <div class="spinner-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
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

    h1 { margin: 0; }

    .users-table-card { overflow-x: auto; }

    table { width: 100%; }

    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background-color: #f5f5f5; }

    .inactive-row { opacity: 0.5; }

    .inactive-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      vertical-align: middle;
      margin-left: 0.25rem;
      color: #f44336;
    }

    .role-secretary { background-color: #e3f2fd; }
    .role-member { background-color: #f5f5f5; }

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
export class UsersListComponent implements OnInit {
  users: UserListDto[] = [];
  displayedColumns = ['name', 'email', 'role', 'committeeMember', 'actions'];
  isLoading = true;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  editUser(id: string): void {
    this.router.navigate(['/users', id, 'edit']);
  }
}
