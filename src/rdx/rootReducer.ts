import { combineReducers, Reducer } from 'redux';

import * as localSettings from 'src/rdx/localSettings/localSettings.reducer';
import * as topMiners from 'src/rdx/topMiners/topMiners.reducer';
import * as poolHashrate from 'src/rdx/poolHashrate/poolHashrate.reducer';
import * as minerHeaderStats from 'src/rdx/minerHeaderStats/minerHeaderStats.reducer';
import * as minerDetails from 'src/rdx/minerDetails/minerDetails.reducer';
import * as minerStats from 'src/rdx/minerStats/minerStats.reducer';
import * as minerWorkers from 'src/rdx/minerWorkers/minerWorkers.reducer';
import * as minerRewards from 'src/rdx/minerRewards/minerRewards.reducer';
import * as minerPayments from 'src/rdx/minerPayments/minerPayments.reducer';
import * as snacks from 'src/rdx/snacks/snacks.reducer';
import * as poolStats from 'src/rdx/poolStats/poolStats.reducer';
import * as poolCoinsFull from 'src/rdx/poolCoinsFull/poolCoinsFull.reducer';
import * as addressSearch from 'src/rdx/addressSearch/addressSearch.reducer';
import * as blocksChart from 'src/rdx/blocksChart/blocksChart.reducer';
import * as minerStatsChart from 'src/rdx/minerStatsChart/minerStatsChart.reduxer';
import { localStorage } from 'src/utils/localStorage';

export const defaultReduxState = {
  localSettings: localSettings.defaultState,
  topMiners: topMiners.defaultState,
  poolHashrate: poolHashrate.defaultState,
  minerHeaderStats: minerHeaderStats.defaultState,
  minerDetails: minerDetails.defaultState,
  minerStats: minerStats.defaultState,
  minerWorkers: minerWorkers.defaultState,
  minerRewards: minerRewards.defaultState,
  minerPayments: minerPayments.defaultState,
  snacks: snacks.defaultState,
  poolStats: poolStats.defaultState,
  poolCoinsFull: poolCoinsFull.defaultState,
  addressSearch: addressSearch.initialState,
  blocksChart: blocksChart.defaultState,
  minerStatsChart: minerStatsChart.defaultState,
};

const combinedReducer = combineReducers({
  localSettings: localSettings.reducer,
  topMiners: topMiners.reducer,
  poolHashrate: poolHashrate.reducer,
  minerHeaderStats: minerHeaderStats.reducer,
  minerDetails: minerDetails.reducer,
  minerStats: minerStats.reducer,
  minerWorkers: minerWorkers.reducer,
  minerRewards: minerRewards.reducer,
  minerPayments: minerPayments.reducer,
  snacks: snacks.reducer,
  poolStats: poolStats.reducer,
  poolCoinsFull: poolCoinsFull.reducer,
  addressSearch: addressSearch.reducer,
  blocksChart: blocksChart.reducer,
  minerStatsChart: minerStatsChart.reducer,
});

export type AppState = ReturnType<typeof combinedReducer>;

export const rootReducer: Reducer = (state, action) => {
  const nextState = combinedReducer(state, action);

  // save localSettings to app_state
  if (action.type.startsWith('@localSettings')) {
    localStorage('app_state').set({
      localSettings: nextState.localSettings,
    });
  }

  return nextState;
};

export default rootReducer;
