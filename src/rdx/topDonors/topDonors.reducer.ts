import {
  createGetArrayReducer,
  composeReducers,
  defaultReducerArrayState,
  DefaultArrayState,
} from 'src/rdx/@utils';
import { ApiDonor } from 'src/types/Donor.types';

export const defaultState = defaultReducerArrayState as DefaultArrayState<ApiDonor>;

const getReducer = createGetArrayReducer<ApiDonor>();

export const reducer = composeReducers('@donors', defaultState)(getReducer);
