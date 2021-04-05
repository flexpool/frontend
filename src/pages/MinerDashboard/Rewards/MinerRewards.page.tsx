import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useRouteMatch } from 'react-router';
import { useAsyncState } from 'src/hooks/useAsyncState';
import {
  useActiveCoin,
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { ApiMinerReward } from 'src/types/Miner.types';
import { fetchApi } from 'src/utils/fetchApi';
import { MinerPplnsStats } from './MinerPplnsStats.section';
import { MinerRewardStatsSection } from './MinerRewardStats.section';
import RewardsChart from './Rewards.chart';

export const MinerRewardsPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();
  const poolStatsState = useAsyncState<
    [
      {
        total: number;
      },
      number
    ]
  >('stats', [{ total: 0 }, 0]);

  const minerRewardsState = useAsyncState<{
    price: number;
    data: ApiMinerReward[];
  }>('minerRewards', { price: 0, data: [] });

  const coinTicker = useActiveCoinTicker();

  const counterTicker = useCounterTicker();

  React.useEffect(() => {
    minerRewardsState.start(
      fetchApi('/miner/rewards', {
        query: {
          address,
          coin: coinTicker,
          countervalue: counterTicker,
        },
      })
    );
  }, [address, coinTicker, counterTicker]);

  React.useEffect(() => {
    const init = {
      query: {
        coin: coinTicker,
      },
    };
    poolStatsState.start(
      Promise.all([
        fetchApi<{
          total: number;
        }>('/pool/hashrate', init),
        fetchApi<number>('/pool/averageHashrate', init),
      ])
    );
  }, [coinTicker]);

  return (
    <>
      <Helmet>
        <title>Miner rewards</title>
      </Helmet>
      <RewardsChart
        counterPrice={minerRewardsState.data?.price || 0}
        rewards={minerRewardsState.data?.data || []}
        error={minerRewardsState.error}
        isLoading={minerRewardsState.isLoading}
      />
      <MinerRewardStatsSection
        counterPrice={minerRewardsState.data?.price || 0}
        rewards={minerRewardsState.data?.data || []}
        averagePoolHashrate={poolStatsState.data && poolStatsState.data[1]}
      />
      <MinerPplnsStats
        averagePoolHashrate={poolStatsState.data && poolStatsState.data[1]}
        poolHashrate={poolStatsState.data && poolStatsState.data[0].total}
      />
    </>
  );
};
