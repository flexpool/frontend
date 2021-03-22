import { AnyAction, Reducer } from 'redux';
import { DefaultState, ReducerOptions } from './types';
import { defaultReducerState } from './defaultReducerState';

export function createCreateReducer<D>(
  initialState: DefaultState<D> = defaultReducerState,
  options: ReducerOptions = {}
) {
  const getReducer: Reducer<DefaultState<D>, AnyAction> = (
    state = initialState,
    action
  ) => {
    const { flushOnError = false, flushOnStart = false } = options;

    if (action.type.endsWith('CREATE_START')) {
      return {
        ...state,
        isCreating: true,
        data: flushOnStart ? initialState.data : state.data,
        error: null,
      };
    }

    if (action.type.endsWith('CREATE_ERROR')) {
      return {
        ...state,
        isCreating: false,
        data: flushOnError ? initialState.data : state.data,
        error: action.payload,
      };
    }

    if (action.type.endsWith('CREATE_SUCCESS')) {
      return {
        ...state,
        isCreating: false,
        data: action.payload,
      };
    }

    return state;
  };

  return getReducer;
}

export default createCreateReducer;
