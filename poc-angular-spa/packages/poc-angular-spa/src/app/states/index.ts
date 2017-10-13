import { createSelector } from 'reselect';
import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';

import { userDomain, IUserState } from './user';

export interface AppState {
    user: IUserState;
}

export const reducers = {
    user: userDomain.reducer
};

const developmentReducer: Function = compose(storeLogger(), combineReducers)(reducers);

export const metaReducer = (state: any, action: any) => developmentReducer(state, action);
