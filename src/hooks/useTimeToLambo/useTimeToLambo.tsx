import { useMemo } from 'react';
import usePoolDailyRewardPerGigahashSecQuery from '@/hooks/api/usePoolDailyRewardPerGigahashSecQuery';
import useMinerStatsQuery from '@/hooks/api/useMinerStatsQuery';
import useMinerBalance from '@/hooks/useMinerBalance';
import {
  useActiveCoin,
  useCounterTicker,
} from '@/rdx/localSettings/localSettings.hooks';
import { useTranslation } from 'next-i18next';

export const LAMBO_PRICE = {
  usd: 200000,
  cad: 250205,
  eur: 180155,
  gbp: 152327,
  sgd: 270749,
  aud: 267024,
  brl: 955060,
  inr: 15157870,
  cny: 1268020,
  rub: 16450063,
  sek: 1862738,
  nzd: 288311,
  thb: 6647300,
  pln: 839087,
  czk: 4402208,
  uah: 5899542,
  lambo: 1,
};

const useTimeToLambo = ({
  coin,
  address,
}: {
  coin: string;
  address: string;
}) => {
  const activeCoin = useActiveCoin();
  const counterTicker = useCounterTicker();
  const { t } = useTranslation('common');
  const { data: dailyRewardsPerGh } = usePoolDailyRewardPerGigahashSecQuery({
    coin,
  });
  const { data: minerStatsState } = useMinerStatsQuery({ coin, address });
  const { data: minerBalance } = useMinerBalance(address, coin);

  const estimatedDailyEarnings = useMemo(() => {
    const rewards = dailyRewardsPerGh;
    const hashrate = minerStatsState?.averageEffectiveHashrate;

    if (rewards === undefined || hashrate === undefined) {
      return null;
    }

    return rewards * (hashrate / 1000000000);
  }, [dailyRewardsPerGh, minerStatsState]);

  const estimatedEarningFiat = useMemo(() => {
    if (estimatedDailyEarnings && minerBalance) {
      return (
        (estimatedDailyEarnings /
          Math.pow(10, activeCoin?.decimalPlaces || 9)) *
        minerBalance.price
      );
    }
    return null;
  }, [estimatedDailyEarnings, activeCoin?.decimalPlaces, minerBalance]);

  if (!estimatedEarningFiat) {
    return '~';
  }

  const time = (LAMBO_PRICE[counterTicker] || 0) / estimatedEarningFiat;

  if (time < 365) return `${time.toFixed(2)} ${t('days')}`;

  return `${(time / 365).toFixed(2)} ${t('years')}`;
};

export default useTimeToLambo;
