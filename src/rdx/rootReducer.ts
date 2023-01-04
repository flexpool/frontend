import { combineReducers, Reducer } from 'redux';

import * as localSettings from 'src/rdx/localSettings/localSettings.reducer';
import * as snacks from 'src/rdx/snacks/snacks.reducer';
import * as addressSearch from 'src/rdx/addressSearch/addressSearch.reducer';
import { localStorage } from 'src/utils/localStorage';
import { get } from 'lodash';
import Cookies from 'js-cookie';
import { COOKIES_PREFERENCE_CURRENCY } from '@/constants';

export const defaultReduxState = {
  localSettings: localSettings.defaultState,
  snacks: snacks.defaultState,
  addressSearch: addressSearch.initialState,
};

const combinedReducer = combineReducers({
  localSettings: localSettings.reducer,
  snacks: snacks.reducer,
  addressSearch: addressSearch.reducer,
});

export type AppState = ReturnType<typeof combinedReducer>;

type CommonAction = {
  type: string;
  payload: any;
};

export const rootReducer: Reducer<any, CommonAction> = (state, action) => {
  const nextState = combinedReducer(state, action);

  // save localSettings to app_state
  if (action.type.startsWith('@localSettings')) {
    localStorage('app_state').set({
      localSettings: nextState.localSettings,
    });

    // Keep cookies in sync with local settings
    const counterTicker = get(action, 'payload.counterTicker');

    if (counterTicker) {
      Cookies.set(COOKIES_PREFERENCE_CURRENCY, counterTicker);
    }
  }

  return nextState;
};

export default rootReducer;
