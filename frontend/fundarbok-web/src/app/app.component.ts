import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MainLayoutComponent],
  template: `
    <ng-container *ngIf="isAuthenticated; else publicPages">
      <app-main-layout></app-main-layout>
    </ng-container>
    <ng-template #publicPages>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (!isAuth && !this.isPublicRoute()) {
        this.router.navigate(['/login']);
      }
    });
  }

  private isPublicRoute(): boolean {
    const publicRoutes = ['/login', '/register'];
    return publicRoutes.includes(this.router.url);
  }
}
