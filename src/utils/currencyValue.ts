import React from 'react';
import { useReduxState } from 'src/rdx/useReduxState';
import { Ticker } from 'src/types/Ticker.types';

const tickers: {
  ticker: Ticker;
  symbol: string;
  symbolPosition: 'START' | 'END';
}[] = [
  {
    ticker: 'usd',
    symbol: '$',
    symbolPosition: 'START',
  },
  {
    ticker: 'cad',
    symbol: 'CA$',
    symbolPosition: 'START',
  },
  {
    ticker: 'eur',
    symbol: '€',
    symbolPosition: 'START',
  },
  {
    ticker: 'gbp',
    symbol: '£',
    symbolPosition: 'START',
  },
  {
    ticker: 'sgd',
    symbol: 'SG$',
    symbolPosition: 'START',
  },
  {
    ticker: 'brl',
    symbol: 'R$',
    symbolPosition: 'START',
  },
  {
    ticker: 'cny',
    symbol: '¥',
    symbolPosition: 'START',
  },
  {
    ticker: 'rub',
    symbol: '₽',
    symbolPosition: 'START',
  },
  {
    ticker: 'uah',
    symbol: '₴',
    symbolPosition: 'START',
  },
  {
    ticker: 'czk',
    symbol: 'Kč',
    symbolPosition: 'END',
  },
  {
    ticker: 'pln',
    symbol: 'zł',
    symbolPosition: 'START',
  },
];

export const getDisplayCounterTickerValue = (
  value?: number | null,
  ticker: string | Ticker = 'usd'
) => {
  if (typeof value !== 'number') {
    return null;
  }

  const val = String((Math.round(value * 100) / 100).toFixed(2)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

  const tickerSettings = tickers.find((item) => item.ticker === ticker);

  if (!tickerSettings) {
    return val;
  }

  if (tickerSettings.symbolPosition === 'START') {
    return `${tickerSettings.symbol}${val}`;
  }

  return `${val} ${tickerSettings.symbol}`;
};

export const useCounterValue = (prices: { [k in Ticker]: number }) => {
  const settingsState = useReduxState('localSettings');
  const ticker = settingsState.counterTicker;
  const result = React.useMemo(() => {
    return getDisplayCounterTickerValue(prices[ticker], ticker);
  }, [ticker, prices]);

  return result;
};
