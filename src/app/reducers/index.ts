import * as articleReducer from './article.reducer';
import * as progressReducer from './progress.reducer';

export interface State {
  article: articleReducer.IArticleState;
  progress: progressReducer.IProgressState;
}

export namespace States {
  export type article = articleReducer.IArticleState;
  export type progress = progressReducer.IProgressState;
}

export const queries = {
  article: articleReducer.queries,
  progress: progressReducer.queries
};

export const reducers = {
  article: articleReducer.reducer,
  progress: progressReducer.reducer
};
