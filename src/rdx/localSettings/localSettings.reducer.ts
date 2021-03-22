import { Reducer } from 'redux';

type LocalSettingsState = {
  coin: string;
};

export const defaultState: LocalSettingsState = {
  coin: 'ETH',
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
