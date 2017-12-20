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
  let newState: IArticleState;
  switch (action.type) {
    case articleActions.articleActionTypes.CREATE_ARTICLE_SUCCESS:
      newState = ImmutabilityHelper.copy(state);
      newState.list.push(action.payload);
      return newState;
    default:
      return state;
  }
};

export const queries = {
  getList: (state: State) => state.article.list
};
