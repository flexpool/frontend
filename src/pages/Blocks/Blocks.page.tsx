import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'src/components/layout/Content';
import { HeaderStat } from 'src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components/macro';

import useWebSocket from 'react-use-websocket';
import { useReduxState } from 'src/rdx/useReduxState';
import { getDisplayLuck } from 'src/utils/luck.utils';
import { BlocksSection } from 'src/sections/Blocks.section';
import { Luck } from 'src/components/Luck';

const SOCKET_URL = (process.env.REACT_APP_API_URL || '').replace('http', 'ws');

const Hero = styled.div`
  /* background: var(--primary); */
`;

export const BlocksPage = () => {
  const statsState = useAsyncState('poolStats');
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
    <>
      <Hero>
        <Helmet>
          <title>Blocks</title>
        </Helmet>
        <HeaderStat>
          <h1>Blocks</h1>
          <p>History of mined blocks by Flexpool community</p>
        </HeaderStat>
        {!!statsState.data && (
          <Content>
            <StatBoxContainer>
              <StatBox
                title="Average Luck"
                value={getDisplayLuck(statsState.data[0])}
              />
              <StatBox
                title="Current Luck"
                value={<Luck value={blockStats.currentLuck} />}
              />
              <StatBox
                title="Network hashrate"
                value={`${formatSi(blockStats.networkHashrate, 'H/s')}`}
              />
              <StatBox
                title="Network difficulty"
                value={`${formatSi(blockStats.difficulty, 'H')}`}
              />
            </StatBoxContainer>
          </Content>
        )}
      </Hero>
      <BlocksSection />
    </>
  );
};
