import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiMinerStatsChartDataPoint } from 'src/types/Miner.types';

export const defaultState =
  defaultReducerArrayState as DefaultArrayState<ApiMinerStatsChartDataPoint>;

const getReducer = createGetArrayReducer<ApiMinerStatsChartDataPoint>(
  defaultState,
  {
    flushOnStart: true,
  }
);

export const reducer = composeReducers(
  '@ApiMinerStatsChart',
  defaultState
)(getReducer);
