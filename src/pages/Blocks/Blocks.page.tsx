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

const SOCKET_URL = (process.env.REACT_APP_API_URL || '').replace('http', 'ws');

export const BlocksPage = () => {
  const statsState = useAsyncState('poolStats', [0]);
  const init = { query: { coin: 'eth' } };

  const localSettingsState = useReduxState('localSettings');
  const websocket = useWebSocket(
    `${SOCKET_URL}/poolws/blocks?coin=${localSettingsState.coin}`
  );

  type ApiBlockSocket = {
    currentLuck: number;
    difficulty: number;
    networkHashrate: number;
  };
  const blockStats = React.useMemo(() => {
    const lastMessage = (websocket.lastJsonMessage as ApiBlockSocket) || {
      currentLuck: 0,
      difficulty: 0,
      networkHasrate: 0,
    };

    return lastMessage;
  }, [websocket.lastJsonMessage]);

  React.useEffect(() => {
    statsState.start(
      Promise.all([fetchApi<number>('/pool/averageLuck', init)])
    );
  }, []);

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
              statsState.data &&
              statsState.data[0] &&
              getDisplayLuck(statsState.data[0] || 0)
            }
          />
          <StatBox
            title="Current Luck"
            value={
              blockStats.currentLuck && <Luck value={blockStats.currentLuck} />
            }
          />
          <StatBox
            title="Network hashrate"
            value={
              blockStats.networkHashrate &&
              `${formatSi(blockStats.networkHashrate, 'H/s')}`
            }
          />
          <StatBox
            title="Network difficulty"
            value={
              blockStats.difficulty && `${formatSi(blockStats.difficulty, 'H')}`
            }
          />
        </StatBoxContainer>
        <BlocksSection />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
};
