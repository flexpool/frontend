import React from 'react';
//
// import { useRouteMatch } from 'react-router';
import { useReduxState } from 'src/rdx/useReduxState';
import { MinerPplnsStats } from './MinerPplnsStats.section';
import { MinerRewardStatsSection } from './MinerRewardStats.section';
import { MinerRewardsBlocksSection } from './MinerReportBlocks.section';
import RewardsChart from './Rewards.chart';

export const MinerRewardsPage: React.FC<{
  address: string;
}> = ({ address }) => {
  const poolStatsState = useReduxState('poolStats');
  const minerRewardsState = useReduxState('minerRewards');

  return (
    <>
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
        address={address}
      />
      <MinerRewardsBlocksSection address={address}></MinerRewardsBlocksSection>
    </>
  );
};
