import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useRouteMatch } from 'react-router';
import { useReduxState } from 'src/rdx/useReduxState';
import { MinerPplnsStats } from './MinerPplnsStats.section';
import { MinerRewardStatsSection } from './MinerRewardStats.section';
import { MinerRewardsBlocksSection } from './MinerReportBlocks.section';
import RewardsChart from './Rewards.chart';

export const MinerRewardsPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();

  const poolStatsState = useReduxState('poolStats');
  const minerRewardsState = useReduxState('minerRewards');

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
