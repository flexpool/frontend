import React from 'react';
import { MinerPplnsStats } from './MinerPplnsStats.section';
import { MinerRewardStatsSection } from './MinerRewardStats.section';
import { MinerRewardsBlocksSection } from './MinerReportBlocks.section';
import { useFetchPoolStats } from '@/rdx/poolStats/poolStats.hooks';
import { useFetchMinerRewards } from '@/rdx/minerRewards/minerRewards.hooks';
import RewardsChart from './Rewards.chart';

export const MinerRewardsPage: React.FC<{
  address: string;
  coinTicker: string;
  counterTicker: string;
}> = ({ address, coinTicker, counterTicker }) => {
  const poolStatsState = useFetchPoolStats(coinTicker);

  const minerRewardsState = useFetchMinerRewards({
    coinTicker,
    address,
    counterTicker,
  });

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
