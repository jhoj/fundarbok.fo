import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { NotificationPromptComponent } from '../../../shared/components/notification-prompt/notification-prompt.component';
import { OfflineIndicatorComponent } from '../../../shared/components/offline-indicator/offline-indicator.component';
import { AppInfoDialogComponent } from '../../../shared/dialogs/app-info-dialog/app-info-dialog.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    TranslatePipe,
    HasRoleDirective,
    NotificationPromptComponent,
    OfflineIndicatorComponent,
    AppInfoDialogComponent
  ],
  template: `
    <app-offline-indicator></app-offline-indicator>
    <app-notification-prompt></app-notification-prompt>

    <mat-toolbar color="primary" class="main-toolbar">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="spacer"></span>
      <div class="toolbar-actions">
        <button mat-icon-button (click)="openAppInfo()" matTooltip="App Info">
          <mat-icon>info</mat-icon>
        </button>
        <button mat-icon-button [matMenuTriggerFor]="languageMenu">
          <mat-icon>language</mat-icon>
        </button>
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>{{ 'navigation.dashboard' | translate }}</span>
          </a>
          <a mat-list-item routerLink="/meetings" routerLinkActive="active">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>{{ 'navigation.meetings' | translate }}</span>
          </a>
          <a mat-list-item *appHasRole="'Secretary'" routerLink="/committees" routerLinkActive="active">
            <mat-icon matListItemIcon>group</mat-icon>
            <span matListItemTitle>{{ 'navigation.committees' | translate }}</span>
          </a>
          <a mat-list-item routerLink="/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>{{ 'navigation.settings' | translate }}</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <mat-menu #languageMenu="matMenu">
      <button mat-menu-item (click)="setLanguage('en')">English</button>
      <button mat-menu-item (click)="setLanguage('fo')">Føroyskt</button>
    </mat-menu>

    <mat-menu #userMenu="matMenu">
      <button mat-menu-item routerLink="/settings">
        <mat-icon>person</mat-icon>
        <span>{{ 'navigation.profile' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>{{ 'navigation.logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .main-toolbar {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .toolbar-actions {
      display: flex;
      gap: 0.5rem;
    }

    .sidenav-container {
      height: calc(100vh - 64px);
    }

    .sidenav {
      width: 250px;
    }

    mat-nav-list {
      padding-top: 1rem;
    }

    mat-list-item {
      border-left: 4px solid transparent;
    }

    mat-list-item.active {
      border-left-color: var(--mdc-theme-primary);
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class MainLayoutComponent {
  currentUser = this.authService.currentUser$;
  sidenavOpen = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }

  openAppInfo(): void {
    this.dialog.open(AppInfoDialogComponent, {
      width: '400px',
      disableClose: false
    });
  }
}
