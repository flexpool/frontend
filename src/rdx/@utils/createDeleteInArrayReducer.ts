import { AnyAction, Reducer } from 'redux';
import { DefaultArrayState, ReducerOptions } from './types';
import { defaultReducerArrayState } from './defaultReducerState';

/**
 * payload should be id to be removed
 * @param initialState
 * @param options
 */
export function createDeleteInArrayReducer<D extends { id: string | number }>(
  initialState: DefaultArrayState<D> = defaultReducerArrayState,
  options: ReducerOptions = {}
) {
  const createDeleteInArray: Reducer<DefaultArrayState<D>, AnyAction> = (
    state = initialState,
    action
  ) => {
    const { flushOnError = false } = options;

    if (action.type.endsWith('DELETE_START')) {
      return {
        ...state,
        isDeleting: true,
        error: null,
      };
    } else if (action.type.endsWith('DELETE_ERROR')) {
      return {
        ...state,
        isCreating: false,
        data: flushOnError ? initialState.data : state.data,
        error: action.payload,
      };
    } else if (
      action.type.endsWith('DELETE_SUCCESS') ||
      action.type.endsWith('DELETE')
    ) {
      const newData = state.data.filter((item) => item.id !== action.payload);
      return {
        ...state,
        isCreating: false,
        data: newData,
      };
    }
    return state;
  };

  return createDeleteInArray;
}

export default createDeleteInArrayReducer;
