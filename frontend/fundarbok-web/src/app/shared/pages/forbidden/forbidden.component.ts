import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, TranslatePipe],
  template: `
    <div class="forbidden-container">
      <div class="forbidden-content">
        <h1>403</h1>
        <h2>{{ 'errors.forbidden' | translate }}</h2>
        <p>{{ 'errors.unauthorized' | translate }}</p>
        <button mat-raised-button color="primary" routerLink="/dashboard">
          {{ 'common.back' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .forbidden-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .forbidden-content {
      text-align: center;
      color: white;
    }

    h1 {
      font-size: 4rem;
      margin: 0;
    }

    h2 {
      font-size: 1.5rem;
      margin: 0.5rem 0;
    }

    p {
      margin: 1rem 0;
      font-size: 1.1rem;
    }

    button {
      margin-top: 1.5rem;
    }
  `]
})
export class ForbiddenComponent {}
