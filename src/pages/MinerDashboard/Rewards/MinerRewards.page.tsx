import React from 'react';
import { MinerPplnsStats } from './MinerPplnsStats.section';
import { MinerRewardStatsSection } from './MinerRewardStats.section';
import { MinerRewardsBlocksSection } from './MinerReportBlocks.section';
import useMinerRewardsQuery from '@/hooks/api/useMinerRewardsQuery';
import usePoolAverageHashrateQuery from '@/hooks/api/usePoolAverageHashrateQuery';
import usePoolHashrateQuery from '@/hooks/api/usePoolHashrateQuery';
import RewardsChart from './Rewards.chart';

export const MinerRewardsPage: React.FC<{
  address: string;
  coinTicker: string;
  counterTicker: string;
}> = ({ address, coinTicker, counterTicker }) => {
  const { data: poolHashrate } = usePoolHashrateQuery({
    coin: coinTicker,
  });

  const { data: poolAverageHashrate } = usePoolAverageHashrateQuery({
    coin: coinTicker,
  });

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
        coin={coinTicker}
        address={address}
        counterPrice={minerRewardsState?.price || 0}
        rewards={minerRewardsState?.data || []}
      />
      <MinerPplnsStats
        coin={coinTicker}
        averagePoolHashrate={poolAverageHashrate}
        poolHashrate={poolHashrate?.total}
        address={address}
      />
      <MinerRewardsBlocksSection address={address}></MinerRewardsBlocksSection>
    </>
  );
};

export default React.memo(MinerRewardsPage);
