import { isBefore, subDays } from 'date-fns';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { CardGrid } from 'src/components/layout/Card';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { Ws } from 'src/components/Typo/Typo';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import {
  useActiveCoin,
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import usePoolDailyRewardPerGigahashSecQuery from '@/hooks/api/usePoolDailyRewardPerGigahashSecQuery';
import { ApiMinerReward } from 'src/types/Miner.types';
import { useLocalizedCurrencyFormatter } from 'src/utils/si.utils';
import useMinerStatsQuery from '@/hooks/api/useMinerStatsQuery';

const getIndexPastInterval = (index: number) => {
  switch (index) {
    case 0:
      return 'rewards.past_earnings.yesterday';
    case 1:
      return 'rewards.past_earnings.last_week';
    case 2:
      return 'rewards.past_earnings.last_month';
    default:
      return 'Unknown';
  }
};
const getIndexInterval = (index: number) => {
  switch (index) {
    case 0:
      return 'rewards.forecasted_earnings.daily';
    case 1:
      return 'rewards.forecasted_earnings.weekly';
    case 2:
      return 'rewards.forecasted_earnings.monthly';
    default:
      return 'Unknown';
  }
};

export const MinerRewardStatsSection: React.FC<{
  coin: string;
  address: string;
  rewards: ApiMinerReward[];
  counterPrice: number;
}> = ({ coin, address, rewards, counterPrice = 0 }) => {
  const coinTicker = useActiveCoinTicker();
  const counterTicker = useCounterTicker();
  const activeCoin = useActiveCoin();
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const { data: dailyRewardsPerGh } = usePoolDailyRewardPerGigahashSecQuery({
    coin,
  });
  const { t } = useTranslation('dashboard');
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const { data: minerStatsState } = useMinerStatsQuery({ coin, address });

  const summary: [number, number, number] = React.useMemo(() => {
    const currentDate = new Date();

    const [year, month, day] = [
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
    ];

    const utc = new Date(Date.UTC(year, month, day));

    let dailySum = 0,
      weeklySum = 0,
      monthlySum = 0;

    rewards.forEach((reward) => {
      const rewardTime = new Date(reward.timestamp * 1000);

      if (isBefore(subDays(utc, 2), rewardTime)) {
        dailySum += reward.totalRewards;
      }

      if (isBefore(subDays(utc, 8), rewardTime)) {
        weeklySum += reward.totalRewards;
      }

      if (isBefore(subDays(utc, 31), rewardTime)) {
        monthlySum += reward.totalRewards;
      }
    });

    return [dailySum, weeklySum, monthlySum];
  }, [rewards]);

  const pastData = React.useMemo(() => {
    return summary.map((item) => ({
      coinValue: item ? activeCoinFormatter(item) : '-',
      counterValue: item
        ? currencyFormatter(
            (item / Math.pow(10, activeCoin?.decimalPlaces || 3)) * counterPrice
          )
        : '-',
    }));
  }, [
    summary,
    activeCoin,
    counterPrice,
    activeCoinFormatter,
    currencyFormatter,
  ]);

  const futureData = React.useMemo(() => {
    const daily =
      dailyRewardsPerGh && minerStatsState?.averageEffectiveHashrate
        ? (minerStatsState?.averageEffectiveHashrate / 1000000000) *
          dailyRewardsPerGh
        : 0;

    return [1, 7, 30.5].map((item) => ({
      coinValue: daily ? activeCoinFormatter(daily * item) : '-',
      counterValue: daily
        ? currencyFormatter(
            ((item * daily) /
              Math.pow(10, activeCoin?.decimalPlaces || 1000000000)) *
              counterPrice
          )
        : '-',
    }));
  }, [
    dailyRewardsPerGh,
    activeCoin,
    minerStatsState,
    counterPrice,
    activeCoinFormatter,
    currencyFormatter,
  ]);

  const earningsCols: DynamicListColumn<{
    coinValue: React.ReactNode;
    counterValue: React.ReactNode;
  }>[] = [
    {
      title: coinTicker,
      alignRight: true,
      Component: ({ data }) => {
        return <Ws>{data.coinValue}</Ws>;
      },
    },
    {
      title: counterTicker,
      alignRight: true,
      Component: ({ data }) => {
        return <Ws>{data.counterValue}</Ws>;
      },
    },
  ];

  return (
    <CardGrid>
      <div>
        <h2>{t('rewards.past_earnings.title')}</h2>
        <DynamicList
          data={pastData}
          columns={[
            {
              title: '',
              Component: ({ index }) => {
                return <strong>{t(getIndexPastInterval(index))}</strong>;
              },
            },
            ...earningsCols,
          ]}
        />
      </div>
      <div>
        <h2>{t('rewards.forecasted_earnings.title')}</h2>
        <DynamicList
          data={futureData}
          columns={[
            {
              title: '',
              Component: ({ index }) => {
                return <strong>{t(getIndexInterval(index))}</strong>;
              },
            },
            ...earningsCols,
          ]}
        />
      </div>
    </CardGrid>
  );
};
