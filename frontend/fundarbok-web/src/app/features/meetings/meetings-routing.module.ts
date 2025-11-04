import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingsListComponent } from './meetings-list/meetings-list.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingsListComponent
  }
  // Future routes:
  // { path: 'new', component: CreateMeetingComponent }
  // { path: ':id', component: MeetingDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
