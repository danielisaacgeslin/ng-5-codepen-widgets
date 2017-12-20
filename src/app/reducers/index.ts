import * as articleReducer from './article.reducer';

export interface State {
  article: articleReducer.IArticleState;
}

export const queries = {
  article: articleReducer.queries
};

export const reducers = {
  article: articleReducer.reducer
};
