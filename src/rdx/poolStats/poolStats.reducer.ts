import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiPoolStats } from 'src/types/PoolStats.types';

export const defaultState = defaultReducerState as DefaultState<ApiPoolStats>;

const getReducer = createGetReducer<ApiPoolStats>();

export const reducer = composeReducers('@poolCoins', defaultState)(getReducer);
