import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent) },
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
      { path: ':id/edit', canActivate: [RoleGuard], data: { role: 'Secretary' }, loadComponent: () => import('./features/committees/pages/committee-form/committee-form.component').then(m => m.CommitteeFormComponent) },
      { path: ':id', loadComponent: () => import('./features/committees/pages/committee-detail/committee-detail.component').then(m => m.CommitteeDetailComponent) }
    ]
  },
  {
    path: 'users',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Secretary' },
    children: [
      { path: '', loadComponent: () => import('./features/users/pages/users-list/users-list.component').then(m => m.UsersListComponent) },
      { path: 'new', loadComponent: () => import('./features/users/pages/user-form/user-form.component').then(m => m.UserFormComponent) },
      { path: ':id/edit', loadComponent: () => import('./features/users/pages/user-form/user-form.component').then(m => m.UserFormComponent) }
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
