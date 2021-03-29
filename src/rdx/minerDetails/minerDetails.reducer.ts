import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiMinerSettings } from 'src/types/Miner.types';

export const defaultState = defaultReducerState as DefaultState<ApiMinerSettings>;

const getReducer = createGetReducer<ApiMinerSettings>(defaultState, {
  flushOnStart: true,
});

export const reducer = composeReducers(
  '@minerDetails',
  defaultState
)(getReducer);
