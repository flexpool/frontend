import { SnackOptions, SnackOptionsInput } from 'src/types/Snack.types';

const remove = (id: SnackOptions['id']) => ({
  type: '@snack/REMOVE',
  payload: id,
});

const create = (snack: SnackOptionsInput) => ({
  type: '@snack/CREATE',
  payload: snack,
});

export const snackActions = {
  remove,
  create,
};
