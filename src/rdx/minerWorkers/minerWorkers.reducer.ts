import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiMinerWorker } from 'src/types/Miner.types';

export const defaultState = defaultReducerArrayState as DefaultArrayState<ApiMinerWorker>;
const getReducer = createGetArrayReducer<ApiMinerWorker>(defaultState, {
  flushOnStart: true,
});
export const reducer = composeReducers(
  '@minerWorkers',
  defaultState
)(getReducer);
