import React from 'react';
import { useRouteMatch } from 'react-router';
import { Spacer } from 'src/components/layout/Spacer';
import StatsChart from './MinerStats.chart';
import { MinerStats } from './Stats.section';
import { MinerWorkers } from './Workers.section';

export const MinerStatsPage = () => {
  const {
    params: { address, coin },
  } = useRouteMatch<{ address: string; coin: string }>();
  return (
    <>
      <MinerStats />
      <Spacer />
      <StatsChart address={address} coinTicker={coin} />
      <MinerWorkers address={address} />
    </>
  );
};
