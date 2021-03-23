import { combineReducers, Reducer } from 'redux';

import * as localSettings from 'src/rdx/localSettings/localSettings.reducer';
import * as poolCoins from 'src/rdx/poolCoins/poolCoins.reducer';

export const defaultReduxState = {
  localSettings: localSettings.defaultState,
  poolCoins: poolCoins.defaultState,
};

const combinedReducer = combineReducers({
  localSettings: localSettings.reducer,
  poolCoins: poolCoins.reducer,
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
