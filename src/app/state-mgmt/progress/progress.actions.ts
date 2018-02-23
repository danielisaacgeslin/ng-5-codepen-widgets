import { Action } from '@ngrx/store';

import { ProgressModels } from '../../models';

export const actionTypes = {
  UPDATE: '[Progress] Update',
  REMOVE: '[Progress] Remove'
};

export class Update implements Action {
  public type: string = actionTypes.UPDATE;
  constructor(public payload: { key: string; progress: ProgressModels.Progress }) { }
}

export class Remove implements Action {
  public type: string = actionTypes.REMOVE;
  constructor(public payload: { key: string }) { }
}
