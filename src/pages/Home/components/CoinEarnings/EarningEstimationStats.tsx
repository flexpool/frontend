import { ApiPoolCoinFull } from '@/types/PoolCoin.types';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { CryptoValue, FiatValue, EstimatedNumbers } from './components';
import { Skeleton } from '@/components/layout/Skeleton';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from '@/utils/si.utils';
import { useCounterTicker } from '@/rdx/localSettings/localSettings.hooks';

type EstimationConfig = {
  n: number; // This is the number of xGH or xMH, given different coin defaultHashrateSiPrefix
  duration: 'daily' | 'monthly';
  coinData?: ApiPoolCoinFull;
};

type Props = { config: EstimationConfig };

export const EarningEstimationStats = ({ config }: Props) => {
  const { t } = useTranslation('home');
  const counterTicker = useCounterTicker();

  const currencyFormatter = useLocalizedCurrencyFormatter();
  const numberFormatter = useLocalizedNumberFormatter();

  const days = config.duration === 'daily' ? 1 : 30.5;

  const [earningsInCoin, earningInFiat] = getCoinEarnings(
    config.coinData,
    config.n,
    days,
    counterTicker
  );

  return (
    <>
      <p>
        {config.n} {config.coinData?.defaultHashrateSiPrefix}
        {config.coinData?.hashrateUnit}{' '}
        {config.duration === 'daily'
          ? t('coin_earnings_cards.daily')
          : t('coin_earnings_cards.monthly')}
      </p>

      {config.coinData?.testnet ? (
        <FiatValue>N/A</FiatValue>
      ) : (
        <EstimatedNumbers>
          <FiatValue>
            {earningInFiat ? (
              currencyFormatter(earningInFiat)
            ) : (
              <Skeleton style={{ height: 25 }} />
            )}
          </FiatValue>
          <CryptoValue>
            {earningsInCoin ? (
              <>
                {'≈ '}
                {numberFormatter(earningsInCoin, {
                  maximumFractionDigits: 5,
                })}{' '}
                {config.coinData?.ticker.toUpperCase()}
              </>
            ) : (
              <Skeleton style={{ height: 10 }} />
            )}
          </CryptoValue>
        </EstimatedNumbers>
      )}
    </>
  );
};

function getDailyCoinEarnings(data: ApiPoolCoinFull, mh: number) {
  var prefixMultiplier = 1;

  if (data.defaultHashrateSiPrefix === 'k') {
    prefixMultiplier = 1000;
  } else if (data.defaultHashrateSiPrefix === 'M') {
    prefixMultiplier = 1000000;
  } else if (data.defaultHashrateSiPrefix === 'G') {
    prefixMultiplier = 1000000000;
  } else if (data.defaultHashrateSiPrefix === 'T') {
    prefixMultiplier = 1000000000000;
  }

  return (
    (((data.chainData.dailyRewardPerGigaHashSec / 1000000000) *
      prefixMultiplier) /
      Math.pow(10, data.decimalPlaces)) *
    mh
  );
}

function getEarningsForDays(
  data: ApiPoolCoinFull,
  m: number,
  day: number,
  counterTicker: string,
  convertToCounterPrice?: boolean
) {
  const earnings = getDailyCoinEarnings(data, m) * day;

  if (convertToCounterPrice) {
    const counterPrice = data?.marketData.prices
      ? data?.marketData.prices[counterTicker]
      : 0;

    return earnings * counterPrice;
  }

  return earnings;
}

function getCoinEarnings(
  data: ApiPoolCoinFull | undefined,
  m: number,
  day: number,
  counterTicker: string
) {
  if (data === undefined) {
    return [0, 0];
  }

  return [
    getEarningsForDays(data, m, day, counterTicker),
    getEarningsForDays(data, m, day, counterTicker, true),
  ];
}
