import React from 'react';
import { useRouteMatch } from 'react-router';
import { useAsyncState } from 'src/hooks/useAsyncState';
import {
  useActiveCoin,
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { ApiMinerReward } from 'src/types/Miner.types';
import { fetchApi } from 'src/utils/fetchApi';
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
  const coin = useActiveCoin();

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
      <RewardsChart
        counterPrice={minerRewardsState.data?.price || 0}
        rewards={minerRewardsState.data?.data || []}
      />
      <MinerRewardStatsSection
        counterPrice={minerRewardsState.data?.price || 0}
        rewards={minerRewardsState.data?.data || []}
        averagePoolHashrate={poolStatsState.data && poolStatsState.data[1]}
      />
    </>
  );
};
