import { combineReducers, Reducer } from 'redux';

import * as localSettings from 'src/rdx/localSettings/localSettings.reducer';
import * as poolCoins from 'src/rdx/poolCoins/poolCoins.reducer';
import * as donors from 'src/rdx/topDonors/topDonors.reducer';
import * as topMiners from 'src/rdx/topMiners/topMiners.reducer';
import * as poolHashrate from 'src/rdx/poolHashrate/poolHashrate.reducer';

export const defaultReduxState = {
  localSettings: localSettings.defaultState,
  poolCoins: poolCoins.defaultState,
  donors: donors.defaultState,
  topMiners: topMiners.defaultState,
  poolHashrate: poolHashrate.defaultState,
};

const combinedReducer = combineReducers({
  localSettings: localSettings.reducer,
  poolCoins: poolCoins.reducer,
  donors: donors.reducer,
  topMiners: topMiners.reducer,
  poolHashrate: poolHashrate.reducer,
});

export type AppState = ReturnType<typeof combinedReducer>;

export const rootReducer: Reducer = (state, action) => {
  // do some global
  if (
    action &&
    ['@user/LOGOUT_SUCCESS', '@user/LOGOUT'].includes(action.type)
  ) {
    console.log('REDUX CACHE RESET');
    return defaultReduxState;
  }

  const nextState = combinedReducer(state, action);
  return nextState;
};

export default rootReducer;
