import { createSelector } from 'reselect';

import { AppState } from '../';
import { UserState } from './user.state';
import { User } from '../../entities/User';

export const getUserState = (state: AppState): UserState => state.user;

export const getUsers = createSelector(getUserState, (state: UserState) => state.users);
