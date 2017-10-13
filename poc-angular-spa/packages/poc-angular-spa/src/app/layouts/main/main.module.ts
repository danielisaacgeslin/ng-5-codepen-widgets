import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main.routing.module';
import { MainComponent } from './main-component/main.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MainComponent]
})
export class MainModule {
  constructor() { }
}
