import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';

import { ProgressModels } from '../models';
import { progressActions } from '../actions';


@Injectable()
export class ProgressEffects {
  @Effect()
  create$: Observable<Action> = this.actions$
    .ofType(progressActions.progressActionTypes.UPDATE)
    .filter((action: progressActions.Update) => action.payload.progress.status === ProgressModels.ProgressStatus.COMPLETE)
    .map((action: progressActions.Update) => new progressActions.Remove({ key: action.payload.key }))
    .delay(500);

  constructor(private actions$: Actions) { }
}
