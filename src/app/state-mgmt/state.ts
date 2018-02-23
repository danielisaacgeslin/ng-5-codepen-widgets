import { progressReducer } from './progress';
import { widgetReducer } from './widget';

export interface State {
  progress: progressReducer.State;
  widget: widgetReducer.State;
}

export namespace States {
  export type progress = progressReducer.State;
}

export const queries = {
  progress: progressReducer.queries,
  widget: widgetReducer.queries
};

export const reducers = {
  progress: progressReducer.reducer,
  widget: widgetReducer.reducer
};
