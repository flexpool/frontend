import { AnyAction, Reducer } from 'redux';
import { DefaultArrayState, ReducerOptions } from './types';
import { defaultReducerArrayState } from './defaultReducerState';

type Identity = string | number;

/**
 * Expecting the payload to be an updated object with all data
 * The new object with "id" property will replace the one in the state array
 *
 * @param initialState
 * @param options
 */
export function createUpdateInArrayReducer<D extends { id: Identity }>(
  initialState: DefaultArrayState<D> = defaultReducerArrayState,
  options: ReducerOptions = {}
) {
  const udpateInArrayReducer: Reducer<DefaultArrayState<D>, AnyAction> = (
    state = initialState,
    action
  ) => {
    const { flushOnError = false } = options;

    /**
     * Handles update start
     */
    if (action.type.endsWith('UPDATE_START')) {
      return {
        ...state,
        isUpdating: true,
        error: null,
      };
    }

    /**
     * Handles update error
     */
    if (action.type.endsWith('UPDATE_ERROR')) {
      return {
        ...state,
        isUpdating: false,
        data: flushOnError ? initialState.data : state.data,
        error: action.payload,
      };
    }

    /**
     * If there is an update action, e.g. @users/UPDATE_SUCCESS
     * The expected payload is the new data of the given item in the list
     * New data will be placed into the array instead of the old one by id
     */
    if (action.type.endsWith('UPDATE_SUCCESS')) {
      const { id } = action.payload;
      const newData = [...(state.data || [])];
      const replaceIndex = newData.findIndex(item => item.id === id);
      newData.splice(replaceIndex, 1, action.payload);

      return {
        ...state,
        isUpdating: false,
        data: [...newData],
      };
    }

    return state;
  };
  return udpateInArrayReducer;
}

export default createUpdateInArrayReducer;
