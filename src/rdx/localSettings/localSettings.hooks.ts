import { useCallback } from 'react';
import { useReduxState } from 'src/rdx/useReduxState';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from './localSettings.actions';
import usePoolCoinsQuery from '@/hooks/usePoolCoinsQuery';

// FIXME: This hook isn't reliable for retrieving the current active coin ticker,
// since the redux state can be updated many re-renders later
/**
 * Get current selected coin from coin selector
 * Coin ticker is always available from redux because of default state
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
  const { data: poolCoins } = usePoolCoinsQuery();

  const tickerToFind = ticker || activeCoinTicker;
  const coin = poolCoins?.coins.find((item) => item.ticker === tickerToFind);

  return coin;
};

/**
 * useCounterTicker gets the current currency setting
 * @returns {string} - currency ticker, e.g. usd
 */
export const useCounterTicker = () => {
  const localSettingsState = useReduxState('localSettings');
  return localSettingsState.counterTicker;
};

/**
 * @deprecated This method is deprecated and will be removed in the future.
 */
export const useAppTheme = () => {
  const localSettingsState = useReduxState('localSettings');

  const colorMode =
    localSettingsState.colorMode !== 'system'
      ? localSettingsState.colorMode
      : localSettingsState.systemColorMode;

  return colorMode;
};

/**
 * read & set coin ticker in local settings
 */
export const useCoinTicker = (): [
  coinTicker: string,
  setCoinTicker: (coinTicker: string) => void
] => {
  const dispatch = useDispatch();
  const localSettingsState = useReduxState('localSettings');

  const setCoinTicker = useCallback(
    (coinTicker: string) => {
      dispatch(localSettingsSet({ coin: coinTicker }));
    },
    [dispatch]
  );

  return [localSettingsState.coin, setCoinTicker];
};
