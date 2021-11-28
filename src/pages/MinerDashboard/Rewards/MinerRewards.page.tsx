import React from 'react';
import { MinerPplnsStats } from './MinerPplnsStats.section';
import { MinerRewardStatsSection } from './MinerRewardStats.section';
import { MinerRewardsBlocksSection } from './MinerReportBlocks.section';
import { useFetchPoolStats } from '@/rdx/poolStats/poolStats.hooks';
import useMinerRewardsQuery from '@/hooks/useMinerRewardsQuery';
import RewardsChart from './Rewards.chart';

export const MinerRewardsPage: React.FC<{
  address: string;
  coinTicker: string;
  counterTicker: string;
}> = ({ address, coinTicker, counterTicker }) => {
  const poolStatsState = useFetchPoolStats(coinTicker);

  const {
    data: minerRewardsState,
    error,
    isLoading,
  } = useMinerRewardsQuery({
    coin: coinTicker,
    address,
    countervalue: counterTicker,
  });

  return (
    <>
      <RewardsChart
        counterPrice={minerRewardsState?.price || 0}
        rewards={minerRewardsState?.data || []}
        error={error?.error}
        isLoading={isLoading}
        address={address}
      />
      <MinerRewardStatsSection
        counterPrice={minerRewardsState?.price || 0}
        rewards={minerRewardsState?.data || []}
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
