import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./meetings-list/meetings-list.component').then(m => m.MeetingsListComponent)
  },
  {
    path: 'my-meetings',
    loadComponent: () => import('./pages/my-meetings/my-meetings.component').then(m => m.MyMeetingsComponent)
  },
  {
    path: 'my-tasks',
    loadComponent: () => import('./pages/my-tasks/my-tasks.component').then(m => m.MyTasksComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/meeting-form/meeting-form.component').then(m => m.MeetingFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/meeting-form/meeting-form.component').then(m => m.MeetingFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/meeting-detail/meeting-detail.component').then(m => m.MeetingDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
