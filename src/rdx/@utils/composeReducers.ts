import { AnyAction, Reducer } from 'redux';
import { DefaultState } from './types';

function getState<State, A extends AnyAction = AnyAction>(
  reducers: Reducer<State, A>[],
  index: number,
  state: State,
  action: A
): State {
  if (reducers.length > index) {
    return getState(
      reducers,
      index + 1,
      reducers[index](state, action),
      action
    );
  }

  return state;
}

export function composeReducers<
  S extends DefaultState<any>,
  A extends AnyAction = AnyAction
>(startName: string, initialState: S) {
  return function withReducers(...reducers: Reducer<S, A>[]) {
    return function wrappingReducer(state: S = initialState, action: A) {
      if (!action || !action.type || !action.type.startsWith(`${startName}/`)) {
        return state;
      }
      if (action.type.endsWith('RESET')) return initialState;
      return getState<S, A>(reducers, 0, state, action);
    };
  };
}

export default composeReducers;
