import { AnyAction, Reducer } from 'redux';
import { DefaultState, ReducerOptions } from './types';
import { defaultReducerState } from './defaultReducerState';

export const createGetReducer = <D>(
  initialState: DefaultState<D> = defaultReducerState,
  options: ReducerOptions = {}
) => {
  const getReducer: Reducer<DefaultState<D>, AnyAction> = (
    state = initialState,
    action
  ) => {
    const { flushOnError = false, flushOnStart = false } = options;

    if (action.type.endsWith('GET_START')) {
      return {
        ...state,
        isLoading: true,
        lastGetStartAt: new Date(),
        counterGet: state.counterGet + 1,
        data: flushOnStart ? initialState.data : state.data,
        error: null,
      };
    }

    if (action.type.endsWith('GET_ERROR')) {
      return {
        ...state,
        isLoading: false,
        data: flushOnError ? initialState.data : state.data,
        error: action.payload,
      };
    }

    if (action.type.endsWith('GET_SUCCESS')) {
      return {
        ...state,
        isLoading: false,
        lastGetSuccessAt: new Date(),
        data: action.payload,
      };
    }

    if (action.type.endsWith('INVALIDATE')) {
      return {
        ...state,
        invalidatedAt: new Date(),
      };
    }

    return state;
  };

  return getReducer;
};

export default createGetReducer;
