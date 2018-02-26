import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { flatMap, switchMap, map, tap } from 'rxjs/operators';

import { WidgetModels } from '../../models';
import * as widgetActions from './widget.actions';
import { queries, State } from './widget.reducer';
import { State as FullState } from '../state';
import { CodepenService } from '../../services/api';
import { localStorageKeys } from '../../constants';

@Injectable()
export class Effects {
  @Effect()
  public fetchWidget$: Observable<Action> = this.actions$
    .ofType<widgetActions.Fetch>(widgetActions.actionTypes.FETCH).pipe(
    flatMap((action: widgetActions.Fetch) => this.codepenService.fetch(action.payload.id)),
    map((widget: WidgetModels.Widget) => new widgetActions.Add(widget))
    );

  @Effect({ dispatch: false })
  public addWidget$: Observable<any> = this.actions$
    .ofType<widgetActions.Add>(widgetActions.actionTypes.ADD).pipe(
    switchMap(() => this.store.select(queries.getState)),
    tap((state: State) => localStorage.setItem(localStorageKeys.WIDGET, JSON.stringify(state)))
    );

  @Effect({ dispatch: false })
  public removeWidget$: Observable<any> = this.actions$
    .ofType<widgetActions.Add>(widgetActions.actionTypes.REMOVE).pipe(
    switchMap(() => this.store.select(queries.getState)),
    tap((state: State) => localStorage.setItem(localStorageKeys.WIDGET, JSON.stringify(state)))
    );

  constructor(
    private actions$: Actions,
    private store: Store<FullState>,
    private codepenService: CodepenService) { }
}
