import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiMinerPayments } from 'src/types/Miner.types';

export const defaultState = defaultReducerState as DefaultState<ApiMinerPayments>;

const getReducer = createGetReducer<ApiMinerPayments>();

export const reducer = composeReducers(
  '@minerPayments',
  defaultState
)(getReducer);
