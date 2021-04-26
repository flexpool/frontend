import React from 'react';
import { useReduxState } from 'src/rdx/useReduxState';
import { Ticker } from 'src/types/Ticker.types';

export const getDisplayCounterTickerValue = (
  value?: number | null,
  ticker: string | Ticker = 'usd'
) => {
  if (typeof value !== 'number') {
    return null;
  }

  // todo localized number
  return Intl.NumberFormat('', { currency: ticker, style: 'currency' }).format(
    value
  );
};

export const useCounterValue = (prices: { [k in Ticker]: number }) => {
  const settingsState = useReduxState('localSettings');
  const ticker = settingsState.counterTicker;
  const result = React.useMemo(() => {
    return getDisplayCounterTickerValue(prices[ticker], ticker);
  }, [ticker, prices]);

  return result;
};
