import { usePoolCoins } from 'src/rdx/poolCoins/poolCoins.hooks';
import { useReduxState } from 'src/rdx/useReduxState';

export const useActiveCoinTicker = () => {
  const localSettingsState = useReduxState('localSettings');
  return localSettingsState.coin;
};

export const useActiveCoin = (ticker?: string) => {
  const activeCoinTicker = useActiveCoinTicker();
  const poolCoinsState = usePoolCoins();

  const tickerToFind = ticker || activeCoinTicker;
  const coin = poolCoinsState.data.find((item) => item.ticker === tickerToFind);

  return coin;
};

export const useCounterTicker = () => {
  const localSettingsState = useReduxState('localSettings');
  return localSettingsState.counterTicker;
};
