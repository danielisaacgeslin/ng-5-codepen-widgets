import { Action } from '@ngrx/store';

import { Article } from '../models';

export const articleActionTypes = {
  CREATE: '[Article] Create',
  CREATE_SUCCESS: '[Article] Create Success',
  CREATE_ERROR: '[Article] Create Error',
};

export type actionTypes = typeof articleActionTypes;

export class Create implements Action {
  public type: string = articleActionTypes.CREATE;

  constructor(public payload: { article: Article, progressKey: string }) { }
}

export class CreateSuccess implements Action {
  public type: string = articleActionTypes.CREATE_SUCCESS;

  constructor(public payload: Article) { }
}
