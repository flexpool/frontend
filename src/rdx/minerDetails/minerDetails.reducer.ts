import {
  createGetReducer,
  composeReducers,
  defaultReducerState,
  DefaultState,
} from 'src/rdx/@utils';
import { ApiMinerDetails } from 'src/types/Miner.types';

export const defaultState = defaultReducerState as DefaultState<ApiMinerDetails>;

const getReducer = createGetReducer<ApiMinerDetails>(defaultState, {
  flushOnStart: true,
});

export const reducer = composeReducers(
  '@minerDetails',
  defaultState
)(getReducer);
