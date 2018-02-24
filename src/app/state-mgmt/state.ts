import { widgetReducer } from './widget';

export interface State {
  widget: widgetReducer.State;
}

export namespace States {
  export type widget = widgetReducer.State;
}

export const queries = {
  widget: widgetReducer.queries
};

export const reducers = {
  widget: widgetReducer.reducer
};
