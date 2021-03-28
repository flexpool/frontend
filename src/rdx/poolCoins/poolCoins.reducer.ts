import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';

type CoinsState = {
  coins: ApiPoolCoin[];
  countervalues: string[];
};

export const defaultState = defaultReducerState as DefaultState<CoinsState>;

const getReducer = createGetReducer<CoinsState>();

export const reducer = composeReducers('@poolCoins', defaultState)(getReducer);
