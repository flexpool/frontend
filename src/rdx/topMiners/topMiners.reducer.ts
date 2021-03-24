import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiTopMiner } from 'src/types/TopMiner.types';

export const defaultState = defaultReducerArrayState as DefaultArrayState<ApiTopMiner>;

const getReducer = createGetArrayReducer<ApiTopMiner>();

export const reducer = composeReducers('@topMiners', defaultState)(getReducer);
