import { Reducer } from 'redux';
import { Ticker } from 'src/types/Ticker.types';
import Cookies from 'js-cookie';

export type LocalSettingsState = {
  coin: string;
  counterTicker: Ticker;
  colorMode: 'light' | 'dark' | 'system'; // Deprecated, check themeControlScript
  systemColorMode: 'light' | 'dark'; // Deprecated, check themeControlScript
};

let cookiePreference = { counterTicker: null };

if (typeof window !== 'undefined') {
  cookiePreference.counterTicker = Cookies.get('preference_currency');
}

export const defaultState: LocalSettingsState = {
  coin: 'etc',
  counterTicker: cookiePreference.counterTicker || 'usd',
  colorMode: 'system', // Deprecated, check themeControlScript
  systemColorMode: 'light',
};

export const reducer: Reducer<LocalSettingsState> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case '@localSettings/SET':
      return {
        ...state,
        ...action.payload,
      };
  }

  return state;
};
