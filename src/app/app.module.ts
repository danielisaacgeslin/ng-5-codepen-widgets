import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers } from './reducers';
import * as effects from './effects';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { ArticleService } from './services/api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([effects.ArticleEffects, effects.ProgressEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 10}),
    SharedModule
  ],
  providers: [ArticleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
