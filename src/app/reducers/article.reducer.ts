import { Action } from '@ngrx/store';

import { State } from './index';
import { ImmutabilityHelper } from '../utils';
import { Article } from '../models';
import { articleActions } from '../actions';

export interface IArticleState {
  list: Article[];
}

export const defaultState: IArticleState = {
  list: [new Article({ title: 'dummy title', description: 'dummy description' })]
};

export const reducer = (state: IArticleState = defaultState, action: any): IArticleState => {
  // let newState: IArticleState; // to use if the whole state needs to be copied
  switch (action.type) {
    case articleActions.articleActionTypes.CREATE_SUCCESS:
      state.list = ImmutabilityHelper.copy(state.list);
      state.list.push(action.payload);
      return state;
    default:
      return state;
  }
};

export const queries = {
  getState: (state: State) => state.article,
  getList: (state: State) => state.article.list
};
