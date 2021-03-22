import { AnyAction, Reducer } from 'redux';

export const chainReducers = <S, A extends AnyAction>(
  reducers: Reducer<S, A>[],
  defaultState: S
) => {
  const mainReducer: Reducer<S, A> = (state = defaultState, action) => {
    let nextState = state;
    reducers.forEach((red) => {
      nextState = red(nextState, action);
    });

    return nextState;
  };

  return mainReducer;
};
