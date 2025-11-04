import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <h1>{{ 'auth.login' | translate }}</h1>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'auth.email' | translate }}</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                {{ 'errors.required' | translate }}
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                {{ 'errors.invalidEmail' | translate }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'auth.password' | translate }}</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                {{ 'errors.required' | translate }}
              </mat-error>
            </mat-form-field>

            <div class="button-group">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!loginForm.valid || isLoading()"
                class="full-width"
              >
                <span *ngIf="!isLoading()">{{ 'auth.signIn' | translate }}</span>
                <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              </button>
            </div>

            <div class="register-link">
              <p>{{ 'auth.noAccount' | translate }}
                <a routerLink="/register">{{ 'auth.signUp' | translate }}</a>
              </p>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    mat-card-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    mat-form-field {
      margin-bottom: 1.5rem;
    }

    .full-width {
      width: 100%;
    }

    .button-group {
      margin-top: 2rem;
    }

    .register-link {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Signed in successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Login failed';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}
