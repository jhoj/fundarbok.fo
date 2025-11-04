import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <h1>{{ 'auth.signUp' | translate }}</h1>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'auth.name' | translate }}</mat-label>
              <input matInput formControlName="name" required>
              <mat-error>{{ 'errors.required' | translate }}</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'auth.email' | translate }}</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                {{ 'errors.required' | translate }}
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                {{ 'errors.invalidEmail' | translate }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'auth.password' | translate }}</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error>{{ 'errors.required' | translate }}</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'auth.confirmPassword' | translate }}</mat-label>
              <input matInput formControlName="confirmPassword" type="password" required>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                {{ 'errors.required' | translate }}
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                {{ 'errors.passwordMismatch' | translate }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'committees.role' | translate }}</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="CommitteeMember">{{ 'committees.member' | translate }}</mat-option>
                <mat-option value="Secretary">{{ 'committees.secretary' | translate }}</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="button-group">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!registerForm.valid || isLoading()"
                class="full-width"
              >
                <span *ngIf="!isLoading()">{{ 'auth.signUp' | translate }}</span>
                <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              </button>
            </div>

            <div class="login-link">
              <p>{{ 'auth.alreadyHaveAccount' | translate }}
                <a routerLink="/login">{{ 'auth.signIn' | translate }}</a>
              </p>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    .register-card {
      width: 100%;
      max-width: 450px;
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

    .login-link {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['CommitteeMember', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { confirmPassword, ...formData } = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Registration failed';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}
