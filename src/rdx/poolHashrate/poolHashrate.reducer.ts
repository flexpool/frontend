import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiPoolHashrateItem } from 'src/types/PoolHashrate.types';

export const defaultState = defaultReducerArrayState as DefaultArrayState<ApiPoolHashrateItem>;

const getReducer = createGetArrayReducer<ApiPoolHashrateItem>();

export const reducer = composeReducers(
  '@poolHashrate',
  defaultState
)(getReducer);
