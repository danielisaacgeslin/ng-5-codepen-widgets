import { Action } from '@ngrx/store';

import { WidgetModels } from '../../models';

export const actionTypes = {
  FETCH: '[Widget] Fetch',
  ADD: '[Widget] Add',
  REMOVE: '[Widget] Remove'
};

export class Fetch implements Action {
  public type: string = actionTypes.FETCH;
  constructor(public payload: { id: string }) { }
}

export class Add implements Action {
  public type: string = actionTypes.ADD;
  constructor(public payload: WidgetModels.Widget) { }
}

export class Remove implements Action {
  public type: string = actionTypes.ADD;
  constructor(public payload: { id: string }) { }
}
