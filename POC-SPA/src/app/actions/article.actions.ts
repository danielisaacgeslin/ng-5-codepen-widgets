import { Action } from '@ngrx/store';

import { Article } from '../models';

type TypeOf<T> = {
  [P in keyof T]: T[P]
};

export const articleActionTypes = {
  CREATE_ARTICLE: '[Article] Create',
  CREATE_ARTICLE_SUCCESS: '[Article] Create Success',
  CREATE_ARTICLE_ERROR: '[Article] Create Error',
};

export type actionTypes = typeof articleActionTypes;

export class CreateArticle implements Action {
  public type: string = articleActionTypes.CREATE_ARTICLE;

  constructor(public payload: Article) { }
}

export class CreateArticleSuccess implements Action {
  public type: string = articleActionTypes.CREATE_ARTICLE_SUCCESS;

  constructor(public payload: Article) { }
}

export class CreateArticleError implements Action {
  public type: string = articleActionTypes.CREATE_ARTICLE_ERROR;

  constructor(public payload: Error) { }
}
