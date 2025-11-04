import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './directives/has-role.directive';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HasRoleDirective,
    TranslatePipe
  ],
  exports: [
    HasRoleDirective,
    TranslatePipe
  ]
})
export class SharedModule { }
