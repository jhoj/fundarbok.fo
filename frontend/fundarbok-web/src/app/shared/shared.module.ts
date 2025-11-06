import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Note: HasRoleDirective and TranslatePipe are standalone components
// Import them directly where needed, not through this module

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ]
})
export class SharedModule { }
