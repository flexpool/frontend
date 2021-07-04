import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useRouteMatch } from 'react-router';
import { useAsyncState } from 'src/hooks/useAsyncState';
import {
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiMinerReward } from 'src/types/Miner.types';
import { fetchApi } from 'src/utils/fetchApi';
import { MinerPplnsStats } from './components/MinerPplnsStatsSection/MinerPplnsStats.section';
import { MinerRewardStatsSection } from './components/MinerRewardsStatsSection/MinerRewardStats.section';
import { MinerRewardsBlocksSection } from './components/MinerReportBlocksSection/MinerReportBlocks.section';
import RewardsChart from './components/RewardsChart/Rewards.chart';

export const MinerRewardsPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();

  const poolStatsState = useReduxState('poolStats');

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
    // eslint-disable-next-line
  }, [address, coinTicker, counterTicker]);

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
        address={address}
      />
      <MinerRewardStatsSection
        counterPrice={minerRewardsState.data?.price || 0}
        rewards={minerRewardsState.data?.data || []}
      />
      <MinerPplnsStats
        averagePoolHashrate={poolStatsState.data?.averageHashrate}
        poolHashrate={poolStatsState.data?.hashrate.total}
      />
      <MinerRewardsBlocksSection address={address}></MinerRewardsBlocksSection>
    </>
  );
};
