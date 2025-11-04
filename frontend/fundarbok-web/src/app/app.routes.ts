import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'meetings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/meetings/meetings.module').then(m => m.MeetingsModule)
  },
  {
    path: 'committees',
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./features/committees/pages/committees-list/committees-list.component').then(m => m.CommitteesListComponent) },
      { path: 'new', canActivate: [RoleGuard], data: { role: 'Secretary' }, loadComponent: () => import('./features/committees/pages/committee-form/committee-form.component').then(m => m.CommitteeFormComponent) },
      { path: ':id', loadComponent: () => import('./features/committees/pages/committee-detail/committee-detail.component').then(m => m.CommitteeDetailComponent) }
    ]
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  { path: 'forbidden', loadComponent: () => import('./shared/pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent) },
  { path: '**', redirectTo: 'dashboard' }
];
