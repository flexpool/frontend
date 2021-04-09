import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';

export const defaultState = defaultReducerArrayState as DefaultArrayState<ApiPoolCoinFull>;

const getReducer = createGetArrayReducer<ApiPoolCoinFull>();

export const reducer = composeReducers(
  '@poolCoinsFull',
  defaultState
)(getReducer);
