import { useReduxState } from 'src/rdx/useReduxState';

/**
 * Get current selected coin from coin selector
 * @returns {string} coin ticker name
 */
export const useActiveCoinTicker = () => {
  const localSettingsState = useReduxState('localSettings');
  return localSettingsState.coin;
};

/**
 * Get api fetched meta data for a coin
 * @param {string} ticker - coin ticker name
 * @returns {Object} coin meta data
 */
export const useActiveCoin = (ticker?: string | string[]) => {
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

export const useAppTheme = () => {
  const localSettingsState = useReduxState('localSettings');

  const colorMode =
    localSettingsState.colorMode !== 'system'
      ? localSettingsState.colorMode
      : localSettingsState.systemColorMode;

  return colorMode;
};
