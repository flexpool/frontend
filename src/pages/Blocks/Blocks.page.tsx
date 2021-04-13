import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'src/components/layout/Content';
import { HeaderStat } from 'src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { formatSi } from 'src/utils/si.utils';
import { BlocksSection } from 'src/sections/Blocks.section';
import { Luck } from 'src/components/Luck';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';

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
    // eslint-disable-next-line
  }, [activeCoinTicker]);

  return (
    <Page>
      <Helmet>
        <title>Blocks</title>
      </Helmet>
      <HeaderStat>
        <h1>Blocks</h1>
        <p>History of mined blocks by community</p>
      </HeaderStat>
      <Content>
        <StatBoxContainer>
          <StatBox
            tooltip={
              <Tooltip>
                <TooltipContent>
                  Last 30 days average block luck.
                </TooltipContent>
              </Tooltip>
            }
            title={<>Average Luck&nbsp;</>}
            value={
              statsState.data && <Luck value={statsState.data.averageLuck} />
            }
          />
          <StatBox
            tooltip={
              <Tooltip>
                <TooltipContent>
                  Current round's block luck. This value is updated in
                  real-time.
                </TooltipContent>
              </Tooltip>
            }
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
            tooltip={
              <Tooltip>
                <TooltipContent>
                  Average amount of how many hashes pool should produce to mine
                  a block.
                </TooltipContent>
              </Tooltip>
            }
            title="Network Difficulty"
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

export default BlocksPage;
