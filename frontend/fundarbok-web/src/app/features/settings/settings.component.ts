import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  template: `
    <div class="settings-container">
      <h1>{{ 'navigation.settings' | translate }}</h1>

      <div class="settings-grid">
        <mat-card class="settings-card">
          <mat-card-header>
            <h2>{{ 'auth.email' | translate }}</h2>
          </mat-card-header>
          <mat-card-content>
            <p>{{ currentUser?.email }}</p>
            <p class="label">{{ 'auth.name' | translate }}</p>
            <p>{{ currentUser?.name }}</p>
            <p class="label">{{ 'committees.role' | translate }}</p>
            <p>{{ currentUser?.role }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <h2>{{ 'navigation.settings' | translate }}</h2>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="settingsForm">
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>{{ 'pages.settings.language' | translate }}</mat-label>
                <mat-select formControlName="language" (change)="onLanguageChange()">
                  <mat-option value="en">{{ 'English' | translate }}</mat-option>
                  <mat-option value="fo">{{ 'Føroyskt' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </form>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="saveSettings()">
              {{ 'common.actions.save' | translate }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
    }

    h2 {
      color: #666;
      font-size: 1.1rem;
      margin-top: 0;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .settings-card {
      padding: 1.5rem;
    }

    mat-card-content {
      padding-bottom: 1rem;
    }

    .label {
      font-weight: 500;
      margin-top: 1rem;
      margin-bottom: 0.25rem;
      color: #666;
    }

    p {
      margin: 0.5rem 0;
      color: #333;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-bottom: 1rem;
    }

    mat-card-actions {
      padding-top: 1rem;
      display: flex;
      gap: 1rem;
    }
  `]
})
export class SettingsComponent implements OnInit {
  currentUser: any;
  settingsForm: FormGroup;

  constructor(
    private authService: AuthService,
    private translationService: TranslationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.settingsForm = this.fb.group({
      language: [this.translationService.getCurrentLanguage()]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  onLanguageChange(): void {
    const language = this.settingsForm.get('language')?.value;
    this.translationService.setLanguage(language);
  }

  saveSettings(): void {
    this.snackBar.open(
      this.translationService.translate('notifications.success.saved'),
      this.translationService.translate('common.actions.close'),
      { duration: 3000 }
    );
  }
}
