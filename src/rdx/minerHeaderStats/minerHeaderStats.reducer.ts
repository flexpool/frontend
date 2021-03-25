import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiMinerHeaderStats } from 'src/types/Miner.types';

export const defaultState = defaultReducerState as DefaultState<ApiMinerHeaderStats>;

const getReducer = createGetReducer<ApiMinerHeaderStats>(defaultState, {
  flushOnStart: true,
});

export const reducer = composeReducers(
  '@minerHeaderStats',
  defaultState
)(getReducer);
