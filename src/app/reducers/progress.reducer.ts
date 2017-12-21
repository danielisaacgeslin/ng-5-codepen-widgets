import { Action } from '@ngrx/store';

import { State } from './index';
import { ImmutabilityHelper } from '../utils';
import { ProgressModels } from '../models';
import { progressActions } from '../actions';

export interface IProgressState {
  [key: string]: ProgressModels.Progress;
}

export const defaultState: IProgressState = {};

export const reducer = (state: IProgressState = defaultState, action: any): IProgressState => {
  let newState: IProgressState;
  switch (action.type) {
    case progressActions.progressActionTypes.REMOVE:
      newState = ImmutabilityHelper.copy(state);
      delete newState[action.payload.key];
      return newState;
    case progressActions.progressActionTypes.UPDATE:
      newState = { ...state };
      newState[action.payload.key] = new ProgressModels.Progress(
        {
          ...newState[action.payload.key],
          ...action.payload.progress
        });
      return newState;
    default:
      return state;
  }
};

export const queries = {
  getState: (state: State) => state.progress
};
