import { Reducer } from 'redux';
import { Ticker } from 'src/types/Ticker.types';

export type LocalSettingsState = {
  coin: string;
  counterTicker: Ticker;
};

export const defaultState: LocalSettingsState = {
  coin: 'eth',
  counterTicker: 'usd',
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
