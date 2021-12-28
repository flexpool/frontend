import { combineReducers, Reducer } from 'redux';

import * as localSettings from 'src/rdx/localSettings/localSettings.reducer';
import * as snacks from 'src/rdx/snacks/snacks.reducer';
import * as poolStats from 'src/rdx/poolStats/poolStats.reducer';
import * as addressSearch from 'src/rdx/addressSearch/addressSearch.reducer';
import { localStorage } from 'src/utils/localStorage';

export const defaultReduxState = {
  localSettings: localSettings.defaultState,
  snacks: snacks.defaultState,
  poolStats: poolStats.defaultState,
  addressSearch: addressSearch.initialState,
};

const combinedReducer = combineReducers({
  localSettings: localSettings.reducer,
  snacks: snacks.reducer,
  poolStats: poolStats.reducer,
  addressSearch: addressSearch.reducer,
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
