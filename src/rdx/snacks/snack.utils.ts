import { SnackOptions, SnackOptionsInput } from 'src/types/Snack.types';

export const createSnack = (
  options: SnackOptionsInput,
  actionType?: string
): SnackOptions => ({
  variant: options.variant || 'default',
  id: options.id || Math.random(),
  autoHide: 3000,
  createdAt: new Date(),
  actionType,
  ...options,
});
