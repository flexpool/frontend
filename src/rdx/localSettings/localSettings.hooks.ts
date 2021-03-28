import { useReduxState } from 'src/rdx/useReduxState';

export const useActiveCoinTicker = () => {
  const localSettingsState = useReduxState('localSettings');
  return localSettingsState.coin;
};

export const useActiveCoin = (ticker?: string) => {
  const activeCoinTicker = useActiveCoinTicker();
  const poolCoinsState = useReduxState('poolCoins');

  const tickerToFind = ticker || activeCoinTicker;

  const coin = poolCoinsState.data?.coins.find(
    (item) => item.ticker === tickerToFind
  );

  return coin;
};

export const useCounterTicker = () => {
  const localSettingsState = useReduxState('localSettings');
  return localSettingsState.counterTicker;
};
