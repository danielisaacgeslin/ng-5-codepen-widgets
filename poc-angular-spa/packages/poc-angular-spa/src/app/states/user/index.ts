import * as actions from './user.actions';
import * as queries from './user.queries';
import { reducer } from './user.reducers';
import { UserState as state } from './user.state';

export { IUserState } from './user.state';

export const userDomain = {
    actions,
    queries,
    reducer,
    state
};
