import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiBlocksChartItem } from 'src/types/PoolStats.types';

export const defaultState = defaultReducerArrayState as DefaultArrayState<ApiBlocksChartItem>;

const getReducer = createGetArrayReducer<ApiBlocksChartItem>();

export const reducer = composeReducers(
  '@blocksChart',
  defaultState
)(getReducer);
