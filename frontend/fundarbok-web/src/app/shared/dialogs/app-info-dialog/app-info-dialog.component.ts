import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VersionService, VersionInfo } from '../../../core/services/version.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-app-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslatePipe
  ],
  template: `
    <div class="app-info-container">
      <h2 mat-dialog-title>{{ 'common.ui.info' | translate }}</h2>
      
      <mat-dialog-content class="info-content">
        <div class="info-item">
          <mat-icon matTooltip="Version" class="info-icon">tag</mat-icon>
          <span class="info-value">{{ versionInfo?.version }}</span>
        </div>
        
        <div class="info-item">
          <mat-icon matTooltip="Build Date" class="info-icon">calendar_today</mat-icon>
          <span class="info-value">{{ versionInfo?.buildDate }}</span>
        </div>
        
        <div class="info-item">
          <mat-icon matTooltip="Commit Hash" class="info-icon">code</mat-icon>
          <span class="info-value mono">{{ versionInfo?.commitHash }}</span>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">
          {{ 'common.actions.close' | translate }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .app-info-container {
      min-width: 300px;
    }

    .info-content {
      padding: 1.5rem 0;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .info-icon {
      flex-shrink: 0;
      color: #1976d2;
      font-size: 1.2rem;
    }

    .info-value {
      flex: 1;
      word-break: break-all;
    }

    .info-value.mono {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }

    mat-dialog-actions {
      padding-top: 1rem;
    }
  `]
})
export class AppInfoDialogComponent implements OnInit {
  versionInfo: VersionInfo | null = null;

  constructor(
    private versionService: VersionService,
    private dialogRef: MatDialogRef<AppInfoDialogComponent>
  ) {}

  ngOnInit(): void {
    this.versionService.getVersionInfo().subscribe(info => {
      this.versionInfo = info;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
