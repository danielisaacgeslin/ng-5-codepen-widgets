import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main.routing.module';
import { SharedModule } from '../../shared/shared.module';

import { MainContainerComponent } from './main-ct-component/main-ct.component';
import { MainFormComponent } from './main-form-component/main-form.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [MainContainerComponent, MainFormComponent],
  providers: []
})
export class MainModule { }
