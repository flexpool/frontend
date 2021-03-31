import { Reducer, AnyAction } from 'redux';
import { SnackOptions, SnackOptionsInput } from 'src/types/Snack.types';

import { chainReducers } from 'src/rdx/@utils/chainReducers';
import { createSnack } from './snack.utils';

type SnackState = { [key: string]: SnackOptions };

export const defaultState: SnackState = {};

const addSnack = (
  state: SnackState,
  actionType: string,
  snack?: SnackOptionsInput
): SnackState => {
  const newSnack = snack ? createSnack(snack, actionType) : null;

  if (newSnack) {
    return {
      ...state,
      [newSnack.id]: newSnack,
    };
  }

  return state;
};

const removeSnack = (state: SnackState, snackId: SnackOptions['id'] | any) => {
  const nextState = { ...state };
  delete nextState[snackId];
  return nextState;
};

/**
 * Adds snack based on action postfix
 * @param state
 * @param action
 */
const getNextStateWithMetaSnack: Reducer<SnackState, AnyAction> = (
  state = defaultState,
  action
) => {
  if (action.meta?.snack && action.type) {
    if (action.type.endsWith('_SUCCESS') && action.meta.snack.success) {
      return addSnack(state, action.type, {
        variant: 'success',
        ...action.meta.snack.success,
      });
    }
    if (action.type.endsWith('_ERROR') && action.meta.snack.error) {
      return addSnack(state, action.type, {
        variant: 'error',
        ...action.meta.snack.error,
      });
    }

    if (action.type.endsWith('_START') && action.meta.snack.start) {
      return addSnack(state, action.type, {
        variant: 'start',
        ...action.meta.snack.start,
      });
    }
  }

  // no change, returns original instance
  return state;
};

/**
 * If we are about to display success or error snack, we want to remove
 * start snack for that async event
 * @param state
 * @param action
 */
const removeStartSnack: Reducer<SnackState, AnyAction> = (
  state = defaultState,
  action
) => {
  if (action.type.endsWith('_SUCCESS') || action.type.endsWith('_ERROR')) {
    const startActionToRemoveFromSnacks = action.type
      .replace('_SUCCESS', '_START')
      .replace('_ERROR', '_START');

    const snackToRemove = Object.values(state).find(
      (item) => item.actionType === startActionToRemoveFromSnacks
    );
    if (snackToRemove) {
      return removeSnack(state, snackToRemove.id);
    }
  }

  return state;
};

export const reducer: Reducer<SnackState, AnyAction> = (
  state = defaultState,
  action
) => {
  let nextState = state;

  switch (action.type) {
    case '@snack/REMOVE':
      return removeSnack(state, action.payload);
    case '@snack/CREATE':
      return addSnack(state, '@snack/CREATE', action.payload);
    default: {
      nextState = removeStartSnack(nextState, action);

      return chainReducers(
        [removeStartSnack, getNextStateWithMetaSnack],
        state
      )(nextState, action);
    }
  }
};
