import { useReduxState } from '../useReduxState';

export const useActiveCoin = () => {
  const localSettingsState = useReduxState('localSettings');
  return localSettingsState.coin;
};
