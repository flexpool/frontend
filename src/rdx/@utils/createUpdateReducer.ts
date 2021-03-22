import { AnyAction, Reducer } from 'redux';
import { DefaultState, ReducerOptionsExtended } from './types';
import { defaultReducerState } from './defaultReducerState';

const hasItemEndsWith = (items: string[], endsWith: string) => {
  const itemEndsWith = items.find((item) => {
    return item.endsWith(endsWith);
  });
  return !!itemEndsWith;
};

/**
 * Update reducer merges old data with new.
 * TODO: add replaceOnSuccess option when needed.
 * @param initialState
 * @param options
 */
export function createUpdateReducer<D>(
  initialState: DefaultState<D> = defaultReducerState,
  options: ReducerOptionsExtended = {}
) {
  const updateReducer: Reducer<DefaultState<D>, AnyAction> = (
    state = initialState,
    action
  ) => {
    const { flushOnError = false, actionTypeStarts = [] } = options;
    const actionTypes = [
      action.type, // default action name,
      ...actionTypeStarts,
    ];
    if (hasItemEndsWith(actionTypes, 'UPDATE_START')) {
      return {
        ...state,
        isUpdating: true,
        error: null,
      };
    }

    if (hasItemEndsWith(actionTypes, 'UPDATE_ERROR')) {
      return {
        ...state,
        isUpdating: false,
        data: flushOnError ? initialState.data : state.data,
        error: action.payload,
      };
    }

    if (hasItemEndsWith(actionTypes, 'UPDATE_SUCCESS')) {
      return {
        ...state,
        isUpdating: false,
        data: {
          ...(state.data || {}),
          ...action.payload,
        },
      };
    }

    return state;
  };

  return updateReducer;
}

export default createUpdateReducer;
