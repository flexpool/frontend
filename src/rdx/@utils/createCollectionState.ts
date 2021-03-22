import { Reducer, AnyAction } from 'redux';
import { arrayToKeyDataObject } from 'src/utils/arrayObjectUtils';
import { CollectionState } from './types';

export const defaultCollectionState: CollectionState<any> = {
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isEnd: false,
  data: {},
  error: null,
};

export type CreateCollectionReducerOptions<I extends object> = {
  defaultState?: CollectionState<I>;
  prefix: string;
  /**
   * object property as a key
   * default: id
   */
  keyIdentifier?: keyof I;
};

const defaultOptions = {
  keyIdentifier: 'id',
  defaultState: defaultCollectionState,
};

const successProperties = {
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  isUpdating: false,
};

/**
 * Stores data as object of objects [key = object[key]: object]
 * for simple updates
 * @param options
 */
export const createCollectionReducer = <I extends object>(
  options: CreateCollectionReducerOptions<I>
) => {
  const { prefix, defaultState, keyIdentifier } = {
    ...defaultOptions,
    keyIdentifier: 'id' as keyof I,
    ...options,
  };

  const actionType = (type: string) => `${prefix}/${type}`;

  const collectionReducer: Reducer<
    CollectionState<I>,
    AnyAction & {
      meta?: {
        append?: boolean;
        target?: string | number;
        payloadStart?: Partial<I>;
        payloadError?: Partial<I>;
        limit?: number;
      };
    }
  > = (prevState = defaultState, action) => {
    let state = prevState;

    /**
     * doesn't start with prefix, immediatelly return state
     */
    if (!action.type.startsWith(prefix)) {
      return state;
    }

    /**
     * __prefix__/RESET
     * returns default state
     */
    if (action.type === actionType('RESET')) {
      return defaultCollectionState;
    }

    /**
     * Handle action error so we don't have to do this every time
     */
    if (action.type.endsWith('_ERROR')) {
      state = {
        ...state,
        error: action.error,
        isLoading: false,
        isCreating: false,
        isDeleting: false,
        isUpdating: false,
      };
    }

    switch (action.type) {
      /**
       * Receiving array of items
       */
      case actionType('GET_START'): {
        // if appending, we will not reset the data state
        const shouldAppend = action.meta?.append;

        return shouldAppend
          ? {
              ...state,
              isLoading: true,
            }
          : {
              ...state,
              isEnd: false,
              isLoading: true,
              data: {},
            };
      }
      case actionType('GET_SUCCESS'): {
        /**
         * if action.meta.append is true
         * data will be merged instead of replaced with action.payload
         */

        const dataAsObject = arrayToKeyDataObject(
          action.payload,
          keyIdentifier
        );

        const shouldAppend = action.meta?.append;
        const limit = action.meta?.limit;
        return {
          ...state,
          // if meta.limit value is higher than number of items received, then we reached end
          isEnd: (limit && limit > action.payload.length) || false,
          ...successProperties,
          data: shouldAppend
            ? {
                ...state.data,
                ...dataAsObject,
              }
            : dataAsObject,
        };
      }

      // CREATE
      case actionType('CREATE_START'):
        return { ...state, isCreating: true };
      case actionType('CREATE_SUCCESS'): {
        if (!action.payload) {
          return state;
        }

        return {
          ...state,
          ...successProperties,
          data: {
            ...state.data,
            ...arrayToKeyDataObject(action.payload, keyIdentifier),
          },
        };
      }

      // DELETE
      case actionType('DELETE_START'):
        return { ...state, isDeleting: action.meta?.target || true };
      case actionType('DELETE_SUCCESS'): {
        const nextState = { ...state, ...successProperties };
        if (action.meta?.target) {
          delete nextState.data[`${action.meta?.target}`];
        }
        return nextState;
      }

      // UPDATE
      case actionType('UPDATE_START'): {
        // check of optimistic payload
        const optimisticPayload = action.meta?.payloadStart;
        if (optimisticPayload) {
          const identifier = optimisticPayload[keyIdentifier];
          if (identifier) {
            const nextItem = {
              ...state.data[`${identifier}`],
              ...optimisticPayload,
            };

            return {
              ...state,
              isUpdating: action.meta?.target || true,
              data: {
                ...state.data,
                [`${identifier}`]: nextItem,
              },
            };
          } else {
            console.warn(
              `Optimistic payload missing key identifier property [${keyIdentifier}]`
            );
          }
        }

        return {
          ...state,
          isUpdating: action.meta?.target || true,
        };
      }

      case actionType('UPDATE_SUCCESS'):
      case actionType('INSERT'): {
        const identifier = (action.payload || {})[keyIdentifier];
        if (identifier) {
          const nextItem = {
            ...state.data[identifier],
            ...action.payload,
          };

          return {
            ...state,
            ...successProperties,
            data: {
              ...state.data,
              [identifier]: nextItem,
            },
          };
        }

        return state;
      }

      case actionType('UPDATE_ERROR'): {
        // check of optimistic payload
        const optimisticPayload = action.meta?.payloadError;
        if (optimisticPayload) {
          const identifier = optimisticPayload[keyIdentifier];
          if (identifier) {
            return {
              ...state,
              data: {
                ...state.data,
                [`${identifier}`]: {
                  ...state.data[`${identifier}`],
                  ...optimisticPayload,
                },
              },
            };
          } else {
            console.warn(
              `Optimistic payload missing key identifier property [${keyIdentifier}]`
            );
          }
        }

        return state;
      }

      default:
        return state;
    }
  };

  return collectionReducer;
};
