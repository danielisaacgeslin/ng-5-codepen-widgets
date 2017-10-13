import { User } from '../../entities/User';

export interface IUserState {
    users: User[];
}

export class UserState implements IUserState {
    public users: User[] = [new User({ name: 'dan', age: 15 })];
}
