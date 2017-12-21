import { Action } from '@ngrx/store';

import { ProgressModels } from '../models';

export const progressActionTypes = {
  UPDATE: '[Progress] Update',
  REMOVE: '[Progress] Remove'
};

export type actionTypes = typeof progressActionTypes;

export class Update implements Action {
  public type: string = progressActionTypes.UPDATE;

  constructor(public payload: { key: string; progress: ProgressModels.Progress }) { }
}

export class Remove implements Action {
  public type: string = progressActionTypes.REMOVE;

  constructor(public payload: { key: string }) { }
}
