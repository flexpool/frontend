import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'src/components/layout/Content';
import { HeaderStat } from 'src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { formatSi } from 'src/utils/si.utils';

import useWebSocket from 'react-use-websocket';
import { useReduxState } from 'src/rdx/useReduxState';
import { getDisplayLuck } from 'src/utils/luck.utils';
import { BlocksSection } from 'src/sections/Blocks.section';
import { Luck } from 'src/components/Luck';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';

export const BlocksPage = () => {
  const statsState = useAsyncState<{
    averageLuck: number;
    currentLuck: number;
    networkHashrate: number;
    networkDifficulty: number;
  } | null>('poolStats', null);
  const activeCoinTicker = useActiveCoinTicker();

  React.useEffect(() => {
    const init = { query: { coin: activeCoinTicker } };
    statsState.start(
      Promise.all([
        fetchApi<number>('/pool/averageLuck', init),
        fetchApi<number>('/pool/currentLuck', init),
        fetchApi<number>('/pool/networkHashrate', init),
        fetchApi<number>('/pool/networkDifficulty', init),
      ]).then(
        ([averageLuck, currentLuck, networkHashrate, networkDifficulty]) => ({
          averageLuck,
          currentLuck,
          networkHashrate,
          networkDifficulty,
        })
      )
    );
  }, [activeCoinTicker]);

  return (
    <Page>
      <Helmet>
        <title>Blocks</title>
      </Helmet>
      <HeaderStat>
        <h1>Blocks</h1>
        <p>History of mined blocks by Flexpool community</p>
      </HeaderStat>
      <Content>
        <StatBoxContainer>
          <StatBox
            title="Average Luck"
            value={
              statsState.data && <Luck value={statsState.data.averageLuck} />
            }
          />
          <StatBox
            title="Current Luck"
            value={
              statsState.data && <Luck value={statsState.data.currentLuck} />
            }
          />
          <StatBox
            title="Network hashrate"
            value={
              statsState.data &&
              `${formatSi(statsState.data.networkHashrate, 'H/s')}`
            }
          />
          <StatBox
            title="Network difficulty"
            value={
              statsState.data &&
              `${formatSi(statsState.data.networkDifficulty, 'H')}`
            }
          />
        </StatBoxContainer>
        <BlocksSection />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
};
