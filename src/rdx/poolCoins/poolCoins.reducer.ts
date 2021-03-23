import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';

export const defaultState = defaultReducerArrayState as DefaultArrayState<ApiPoolCoin>;

const getReducer = createGetArrayReducer<ApiPoolCoin>();

export const reducer = composeReducers('@poolCoins', defaultState)(getReducer);
