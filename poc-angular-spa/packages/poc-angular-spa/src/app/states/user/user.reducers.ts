import { UserState } from './user.state';
import * as userActions from './user.actions';

export const reducer = (state = new UserState(), action: userActions.UserActions): UserState => {
    const newState: UserState = Object.assign({}, state);
    switch (action.type) {

        case userActions.UserActionTypes.ADD_USER:
            newState.users = state.users.concat([action.payload]);
            return newState;

        default: return state;
    }
};
