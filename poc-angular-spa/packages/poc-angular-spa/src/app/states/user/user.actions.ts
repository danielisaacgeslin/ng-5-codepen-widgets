import { Action } from '@ngrx/store';

import { User } from '../../entities/User';

export const UserActionTypes = {
    ADD_USER: '[User] add a user'
};

export class AddUser implements Action {
    public type = UserActionTypes.ADD_USER;
    constructor(public payload: User) { }
}

export type UserActions = AddUser;
