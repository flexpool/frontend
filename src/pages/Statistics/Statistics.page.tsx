import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { HeaderStat } from 'src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { poolStatsGet } from 'src/rdx/poolStats/poolStats.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components/macro';
import PoolHashrateChart from './PoolHashRate.chart';

const Hero = styled.div`
  /* background: var(--primary); */
`;

// const defaultState: [{ total: number }, number, number, number] = [
//   { total: 0 },
//   0,
//   0,
//   0,
// ];

export const StatisticsPage = () => {
  const d = useDispatch();

  const activeTicker = useActiveCoinTicker();
  React.useEffect(() => {
    d(poolStatsGet(activeTicker));
  }, [activeTicker, d]);

  const poolStatsState = useReduxState('poolStats');

  return (
    <Page>
      <Hero>
        <Helmet>
          <title>Statistics</title>
        </Helmet>
        <HeaderStat>
          <h1>Statistics</h1>
        </HeaderStat>
        <Content>
          <StatBoxContainer>
            <StatBox
              title="Pool hashrate"
              value={formatSi(poolStatsState.data?.hashrate.total, 'H/s')}
            />
            <StatBox
              title="Average Luck"
              value={
                poolStatsState.data?.averageLuck &&
                `${
                  Math.round(
                    (poolStatsState.data?.averageLuck || 0) * 100 * 10
                  ) / 10
                }%`
              }
            />
            <StatBox title="Miners" value={poolStatsState.data?.minerCount} />
            <StatBox title="Workers" value={poolStatsState.data?.minerCount} />
          </StatBoxContainer>
        </Content>
        <Content>
          <PoolHashrateChart />
        </Content>
        <Spacer size="xl" />
      </Hero>
    </Page>
  );
};
