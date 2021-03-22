import { AnyAction, Reducer } from 'redux';
import { DefaultArrayState, ReducerOptions } from './types';
import { defaultReducerArrayState } from './defaultReducerState';

export function createCreateInArrayReducer<D>(
  initialState: DefaultArrayState<D> = defaultReducerArrayState,
  options: ReducerOptions = {}
) {
  const createInArrayReducer: Reducer<DefaultArrayState<D>, AnyAction> = (
    state = initialState,
    action
  ) => {
    const { flushOnError = false } = options;

    if (action.type.endsWith('CREATE_START')) {
      return {
        ...state,
        isCreating: true,
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
      const newData = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      return {
        ...state,
        isCreating: false,
        data: [...newData, ...(state.data || [])],
      };
    }
    return state;
  };

  return createInArrayReducer;
}

export default createCreateInArrayReducer;
