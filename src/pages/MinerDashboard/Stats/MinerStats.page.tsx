import React from 'react';
import { useRouteMatch } from 'react-router';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { StatItem } from 'src/components/StatItem';
import { useReduxState } from 'src/rdx/useReduxState';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components';
import { MinerStats } from './Stats.section';
import { MinerWorkers } from './Workers.section';

export const MinerStatsPage = () => {
  const match = useRouteMatch<{ address: string }>();
  return (
    <>
      <MinerStats />
      <MinerWorkers address={match.params.address} />
    </>
  );
};
