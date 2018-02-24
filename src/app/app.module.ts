import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers, WidgetEffects } from './state-mgmt';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { CodepenService } from './services/api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([WidgetEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 10}),
    SharedModule
  ],
  providers: [CodepenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
