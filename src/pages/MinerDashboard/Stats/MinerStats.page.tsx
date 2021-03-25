import React from 'react';
import { useRouteMatch } from 'react-router';
import StatsChart from './StatCharts';
import { MinerStats } from './Stats.section';
import { MinerWorkers } from './Workers.section';

export const MinerStatsPage = () => {
  const {
    params: { address, coin },
  } = useRouteMatch<{ address: string; coin: string }>();
  return (
    <>
      <MinerStats />
      <StatsChart address={address} coinTicker={coin} />
      <MinerWorkers address={address} />
    </>
  );
};
