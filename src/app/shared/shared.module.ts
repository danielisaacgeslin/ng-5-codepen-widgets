import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [ProgressBarComponent],
  exports: [ProgressBarComponent],
  providers: []
})
export class SharedModule { }
