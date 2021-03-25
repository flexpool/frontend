import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiMinerStats } from 'src/types/Miner.types';

export const defaultState = defaultReducerState as DefaultState<ApiMinerStats>;

const getReducer = createGetReducer<ApiMinerStats>(defaultState, {
  flushOnStart: true,
});

export const reducer = composeReducers('@minerStats', defaultState)(getReducer);
