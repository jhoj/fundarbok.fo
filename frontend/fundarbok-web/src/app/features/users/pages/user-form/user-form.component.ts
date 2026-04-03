import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { CommitteeService } from '../../../../core/services/committee.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { Committee, CommitteeMember } from '../../../../models/committee.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    TranslatePipe
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <h1>{{ isEditMode ? ('users.form.editUser' | translate) : ('users.form.createNew' | translate) }}</h1>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'common.ui.name' | translate }}</mat-label>
              <input matInput formControlName="name" required>
              <mat-error>{{ 'errors.validation.required' | translate }}</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'users.fields.email' | translate }}</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error>{{ 'errors.validation.email' | translate }}</mat-error>
            </mat-form-field>

            <mat-form-field *ngIf="!isEditMode" appearance="fill" class="full-width">
              <mat-label>{{ 'users.fields.password' | translate }}</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error>{{ 'errors.validation.minLength' | translate }}</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'users.fields.role' | translate }}</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="Secretary">{{ 'users.roles.Secretary' | translate }}</mat-option>
                <mat-option value="CommitteeMember">{{ 'users.roles.CommitteeMember' | translate }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>{{ 'users.fields.committee' | translate }}</mat-label>
              <mat-select formControlName="committeeId" (selectionChange)="onCommitteeChange()">
                <mat-option [value]="null">-</mat-option>
                <mat-option *ngFor="let c of committees" [value]="c.id">{{ c.name }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field *ngIf="committeeMembers.length > 0" appearance="fill" class="full-width">
              <mat-label>{{ 'users.fields.committeeMember' | translate }}</mat-label>
              <mat-select formControlName="committeeMemberId">
                <mat-option [value]="null">-</mat-option>
                <mat-option *ngFor="let m of committeeMembers" [value]="m.id">
                  {{ m.name }} ({{ m.role }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div *ngIf="isEditMode" class="toggle-row">
              <mat-slide-toggle formControlName="isActive" color="primary">
                {{ 'users.fields.isActive' | translate }}
              </mat-slide-toggle>
            </div>

            <div class="button-group">
              <button mat-raised-button type="button" (click)="goBack()">
                {{ 'common.actions.cancel' | translate }}
              </button>
              <button *ngIf="isEditMode" mat-raised-button color="warn" type="button" (click)="deleteUser()">
                {{ 'common.actions.delete' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!userForm.valid || isSaving()"
              >
                <span *ngIf="!isSaving()">{{ 'common.actions.save' | translate }}</span>
                <mat-spinner *ngIf="isSaving()" diameter="20"></mat-spinner>
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

    mat-card { padding: 2rem; }
    mat-card-header { margin-bottom: 2rem; }
    h1 { margin: 0; color: #333; }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .toggle-row {
      margin-bottom: 1.5rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 600px) {
      .button-group { flex-direction: column; }
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isSaving = signal(false);
  isEditMode = false;
  committees: Committee[] = [];
  committeeMembers: CommitteeMember[] = [];
  private userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private committeeService: CommitteeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translationService: TranslationService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CommitteeMember', Validators.required],
      committeeId: [null],
      committeeMemberId: [null],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.committeeService.getCommittees().subscribe(c => this.committees = c);

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = params['id'];
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.loadUser();
      }
    });
  }

  loadUser(): void {
    if (!this.userId) return;

    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          committeeMemberId: user.committeeMemberId,
          isActive: user.isActive
        });

        // If user has a committee member, load that committee's members
        if (user.committeeMemberId) {
          this.loadCommitteeMemberContext(user.committeeMemberId);
        }
      },
      error: () => {
        this.snackBar.open('User not found', 'Close', { duration: 5000 });
        this.goBack();
      }
    });
  }

  private loadCommitteeMemberContext(committeeMemberId: string): void {
    // Find which committee this member belongs to
    for (const committee of this.committees) {
      this.committeeService.getMembers(committee.id).subscribe(members => {
        const found = members.find(m => m.id === committeeMemberId);
        if (found) {
          this.userForm.patchValue({ committeeId: committee.id });
          this.committeeMembers = members;
        }
      });
    }
  }

  onCommitteeChange(): void {
    const committeeId = this.userForm.get('committeeId')?.value;
    this.userForm.patchValue({ committeeMemberId: null });
    this.committeeMembers = [];

    if (committeeId) {
      this.committeeService.getMembers(committeeId).subscribe(members => {
        this.committeeMembers = members;
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.userForm.value;

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
        committeeMemberId: formValue.committeeMemberId,
        isActive: formValue.isActive
      }).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snackBar.open(
            this.translationService.translate('users.messages.userUpdated'),
            this.translationService.translate('common.actions.close'),
            { duration: 3000 }
          );
          this.goBack();
        },
        error: (error) => {
          this.isSaving.set(false);
          this.snackBar.open(error.error?.message || 'Error', 'Close', { duration: 5000 });
        }
      });
    } else {
      this.userService.createUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        role: formValue.role,
        committeeMemberId: formValue.committeeMemberId
      }).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snackBar.open(
            this.translationService.translate('users.messages.userCreated'),
            this.translationService.translate('common.actions.close'),
            { duration: 3000 }
          );
          this.goBack();
        },
        error: (error) => {
          this.isSaving.set(false);
          this.snackBar.open(error.error?.message || 'Error', 'Close', { duration: 5000 });
        }
      });
    }
  }

  deleteUser(): void {
    if (!this.userId || !confirm(this.translationService.translate('users.messages.confirmDelete'))) return;

    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.snackBar.open(
          this.translationService.translate('users.messages.userDeleted'),
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
        this.goBack();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error', 'Close', { duration: 5000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
