import { createSelector } from 'reselect';
import { compose } from '@ngrx/core/compose';
import { combineReducers, ActionReducer } from '@ngrx/store';

import { userDomain, IUserState } from './user';

export interface AppState {
    user: IUserState;
}

export const reducers = {
    user: userDomain.reducer
};

const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    return productionReducer(state, action);
}
