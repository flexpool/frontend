import { combineReducers, Reducer } from 'redux';

import * as localSettings from 'src/rdx/localSettings/localSettings.reducer';

export const defaultReduxState = {
  localSettings: localSettings.defaultState,
};

const combinedReducer = combineReducers({
  localSettings: localSettings.reducer,
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
