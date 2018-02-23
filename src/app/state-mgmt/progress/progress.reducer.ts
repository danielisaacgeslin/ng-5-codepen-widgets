import { Action } from '@ngrx/store';

import { State as FullState } from '../state';
import { ImmutabilityHelper } from '../../utils';
import { ProgressModels } from '../../models';
import { actionTypes } from './progress.actions';

export interface State {
  [key: string]: ProgressModels.Progress;
}

export const initialState: State = {};

export const reducer = (state: State = initialState, action: any): State => {
  let newState: State;
  switch (action.type) {
    case actionTypes.REMOVE:
      newState = ImmutabilityHelper.copy(state);
      delete newState[action.payload.key];
      return newState;
    case actionTypes.UPDATE:
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
  getState: (state: FullState) => state.progress
};
