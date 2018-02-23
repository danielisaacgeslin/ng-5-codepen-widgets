import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProgressBarComponent } from './progress-bar';
import { WidgetComponent } from './widget';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [ProgressBarComponent, WidgetComponent],
  exports: [ProgressBarComponent, WidgetComponent],
  providers: []
})
export class SharedModule { }
