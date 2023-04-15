import React from 'react';
import { processTicker } from '@/utils/ticker';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useLocalizedNumberFormatter } from 'src/utils/si.utils';
import styled from 'styled-components';

const TickWrapper = styled.span`
  color: var(--primary);
`;

const Tick: React.FC<{ ticker: string; testnet?: boolean }> = ({
  ticker,
  testnet,
}) => {
  ticker = processTicker(ticker, testnet);
  return <TickWrapper className="ticker">{ticker}</TickWrapper>;
};

export const useLocalizedCoinValueFormatter = ({
  coin,
  defaultOptions,
}: {
  coin: string;
  defaultOptions?: Intl.NumberFormatOptions | undefined;
}) => {
  const activeCoin = useActiveCoin(coin);

  const numberFormatter = useLocalizedNumberFormatter();

  const formatter = React.useCallback(
    (value?: number, options?: Intl.NumberFormatOptions | undefined) => {
      const opts: Intl.NumberFormatOptions = {
        maximumFractionDigits: 4,
        ...defaultOptions,
        ...options,
      };

      if (!activeCoin || typeof value !== 'number') {
        return null;
      }
      return (
        <span>
          {numberFormatter(
            value / Math.pow(10, activeCoin?.decimalPlaces || 100),
            opts
          )}{' '}
          <Tick ticker={activeCoin?.ticker} testnet={activeCoin?.testnet} />
        </span>
      );
    },
    [defaultOptions, activeCoin, numberFormatter]
  );

  return formatter;
};

export const useLocalizedActiveCoinValueFormatter = (
  defaultOptions?: Intl.NumberFormatOptions | undefined
) => {
  const activeCoin = useActiveCoin();

  const numberFormatter = useLocalizedNumberFormatter();

  const formatter = React.useCallback(
    (value?: number, options?: Intl.NumberFormatOptions | undefined) => {
      const opts: Intl.NumberFormatOptions = {
        maximumFractionDigits: 4,
        ...defaultOptions,
        ...options,
      };

      if (!activeCoin || typeof value !== 'number') {
        return null;
      }
      return (
        <span>
          {numberFormatter(
            value / Math.pow(10, activeCoin?.decimalPlaces || 100),
            opts
          )}{' '}
          <Tick ticker={activeCoin?.ticker} testnet={activeCoin?.testnet} />
        </span>
      );
    },
    [defaultOptions, activeCoin, numberFormatter]
  );

  return formatter;
};

/**
 * Returns a converter function that converts a number (coin related) to
 * human readable format
 */
export const useLocalizedActiveCoinValueConverter = () => {
  const activeCoin = useActiveCoin();

  const formatter = React.useCallback(
    (value?: number) => {
      if (!activeCoin || typeof value !== 'number') {
        return null;
      }
      return value / Math.pow(10, activeCoin?.decimalPlaces || 100);
    },
    [activeCoin]
  );

  return formatter;
};
