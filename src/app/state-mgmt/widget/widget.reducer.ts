import { Action } from '@ngrx/store';

import { localStorageKeys } from '../../constants';
import { State as FullState } from '../state';
import { WidgetModels } from '../../models';
import { actionTypes } from './widget.actions';

export interface State {
  list: WidgetModels.Widget[];
}

let storedState: any = localStorage.getItem(localStorageKeys.WIDGET);
storedState = storedState && JSON.parse(storedState);

export const initialState: State = storedState || { list: [] };
export const reducer = (state: State = initialState, action: any): State => {
  let newState: State;
  switch (action.type) {
    case actionTypes.ADD:
      newState = { ...state };
      newState.list = newState.list.concat([action.payload]);
      return newState;
      case actionTypes.REMOVE:
      newState = { ...state };
      newState.list = newState.list.filter(widget => widget.id !== action.payload.id);
      return newState;
    default:
      return state;
  }
};

export const queries = {
  getState: (state: FullState) => state.widget,
  getList: (state: FullState) => state.widget.list
};
