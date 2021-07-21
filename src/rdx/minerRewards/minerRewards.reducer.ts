import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiMinerRewards } from 'src/types/Miner.types';

export const defaultState = defaultReducerState as DefaultState<ApiMinerRewards>;
const getReducer = createGetReducer<ApiMinerRewards>(defaultState, {
  flushOnStart: true,
});
export const reducer = composeReducers(
  '@minerRewards',
  defaultState
)(getReducer);
