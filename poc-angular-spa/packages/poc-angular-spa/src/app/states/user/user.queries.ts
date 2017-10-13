import { createSelector } from 'reselect';

import { AppState } from '../';
import { UserState } from './user.state';
import { User } from '../../entities/User';

export const getUserState = (state: any): UserState => state.store.user;

export const getUsers = createSelector(getUserState, (state: UserState) => state.users);
