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
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiMinerReward } from 'src/types/Miner.types';
import { useLocalizedCurrencyFormatter } from 'src/utils/si.utils';

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
  rewards: ApiMinerReward[];
  counterPrice: number;
}> = ({ rewards, counterPrice = 0 }) => {
  // const dailyRewardPerGhState = useAsyncState('dailyRewGh', 0);
  const coinTicker = useActiveCoinTicker();
  const counterTicker = useCounterTicker();
  const activeCoin = useActiveCoin();
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const { t } = useTranslation('dashboard');
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const minerStatsState = useReduxState('minerStats');

  const summary: [number, number, number] = React.useMemo(() => {
    const dailySum = rewards[0] ? rewards[0].totalRewards : 0;

    const weeklySum = rewards
      .filter((item) =>
        isBefore(subDays(new Date(), 7), new Date(item.timestamp * 1000))
      )
      .reduce((res, next) => {
        return res + next.totalRewards;
      }, 0);

    const monthlySum = rewards.reduce((res, next) => {
      return res + next.totalRewards;
    }, 0);

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

  const minerHeaderStats = useReduxState('minerHeaderStats');

  const futureData = React.useMemo(() => {
    const daily =
      minerHeaderStats.data?.dailyRewardsPerGh &&
      minerStatsState.data?.averageEffectiveHashrate
        ? (minerStatsState.data?.averageEffectiveHashrate / 1000000000) *
          minerHeaderStats.data?.dailyRewardsPerGh
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
    minerHeaderStats.data?.dailyRewardsPerGh,
    activeCoin,
    minerStatsState.data?.averageEffectiveHashrate,
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
