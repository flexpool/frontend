import React from 'react';
import { Helmet } from 'react-helmet-async';
import Chart from 'src/components/Chart';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { HeaderStat } from 'src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components/macro';
import PoolHashrateChart from './PoolHashRate.chart';

const Hero = styled.div`
  /* background: var(--primary); */
`;

const defaultState: [{ total: number }, number, number, number] = [
  { total: 0 },
  0,
  0,
  0,
];

export const StatisticsPage = () => {
  const statsState = useAsyncState<typeof defaultState>(
    'poolStats',
    defaultState
  );
  const init = { query: { coin: 'eth' } };

  React.useEffect(() => {
    statsState.start(
      Promise.all([
        fetchApi<{
          total: number;
        }>('/pool/hashrate', init),
        fetchApi<number>('/pool/averageLuck', init),
        fetchApi<number>('/pool/minerCount', init),
        fetchApi<number>('/pool/workerCount', init),
      ])
    );
  }, []);

  const data = React.useMemo(() => {
    return statsState.data || defaultState;
  }, [statsState.data]);

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
              isLoading={statsState.isLoading}
              title="Pool hashrate"
              value={formatSi(data[0].total, 'H/s')}
            />
            <StatBox
              isLoading={statsState.isLoading}
              title="Average Luck"
              value={`${Math.round(data[1] * 100 * 10) / 10}%`}
            />
            <StatBox
              isLoading={statsState.isLoading}
              title="Miners"
              value={data[2]}
            />
            <StatBox
              isLoading={statsState.isLoading}
              title="Workers"
              value={data[3]}
            />
          </StatBoxContainer>
        </Content>
        <Content padding>
          <h2>Pool hashrate</h2>
          <PoolHashrateChart />
        </Content>
        {/* <Chart
          data={{
            labels: [1, 2, 3, 4, 5],
            datasets: [
              {
                data: [1, 2, 4, 5, 6],
                label: 'Visitors',
                backgroundColor: 'transparent',
                borderColor: 'red',
              },
              {
                data: [4, 5, 6, 7, 8],
                label: 'Visitors',
                backgroundColor: 'transparent',
                borderColor: 'blue',
              },
              {
                data: [3, 5, 7, 3, 4],
                label: 'Visitors',
                backgroundColor: 'transparent',
                borderColor: 'green',
              },
            ],
          }}
        /> */}
      </Hero>
    </Page>
  );
};
