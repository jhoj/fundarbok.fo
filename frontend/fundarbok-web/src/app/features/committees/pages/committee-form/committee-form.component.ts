import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommitteeService } from '../../../../core/services/committee.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-committee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <h1>{{ isEditMode ? ('committees.form.editCommittee' | translate) : ('committees.form.createNew' | translate) }}</h1>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="committeeForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'committees.form.name' | translate }}</mat-label>
              <input matInput formControlName="name" required>
              <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'committees.form.description' | translate }}</mat-label>
              <textarea matInput formControlName="description" rows="4"></textarea>
            </mat-form-field>

            <div class="button-group">
              <button mat-raised-button type="button" (click)="goBack()">
                {{ 'common.actions.cancel' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!committeeForm.valid || isLoading()"
              >
                <span *ngIf="!isLoading()">{{ 'common.actions.save' | translate }}</span>
                <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 2rem;
      max-width: 700px;
      margin: 0 auto;
    }

    mat-card {
      padding: 2rem;
    }

    mat-card-header {
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 600px) {
      .button-group {
        flex-direction: column;
      }
    }
  `]
})
export class CommitteeFormComponent implements OnInit {
  committeeForm: FormGroup;
  isLoading = signal(false);
  isEditMode = false;
  private committeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private committeeService: CommitteeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translationService: TranslationService
  ) {
    this.committeeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.committeeId = params['id'];
        this.loadCommittee();
      }
    });
  }

  loadCommittee(): void {
    if (!this.committeeId) return;

    this.isLoading.set(true);
    this.committeeService.getCommittee(this.committeeId).subscribe({
      next: (committee) => {
        this.committeeForm.patchValue({
          name: committee.name,
          description: committee.description
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open(
          this.translationService.translate('errors.business.committeeNotFound'),
          this.translationService.translate('common.actions.close'),
          { duration: 5000 }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.committeeForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const request$ = this.isEditMode && this.committeeId
      ? this.committeeService.updateCommittee(this.committeeId, this.committeeForm.value)
      : this.committeeService.createCommittee(this.committeeForm.value);

    request$.subscribe({
      next: (committee) => {
        this.isLoading.set(false);
        const message = this.isEditMode
          ? this.translationService.translate('committees.messages.committeeUpdated')
          : this.translationService.translate('committees.messages.committeeCreated');
        this.snackBar.open(message, this.translationService.translate('common.actions.close'), { duration: 3000 });
        this.router.navigate(['/committees', committee.id]);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || this.translationService.translate('notifications.error.failedToSave');
        this.snackBar.open(message, this.translationService.translate('common.actions.close'), { duration: 5000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/committees']);
  }
}
