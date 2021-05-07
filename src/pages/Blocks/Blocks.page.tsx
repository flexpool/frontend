import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'src/components/layout/Content';
import { HeaderStat } from 'src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import { BlocksSection } from 'src/sections/Blocks.section';
import { Luck } from 'src/components/Luck';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { BlocksChart } from './Blocks.chart';

export const BlocksPage = () => {
  const statsState = useAsyncState<{
    averageLuck: number;
    currentLuck: number;
    networkHashrate: number;
    networkDifficulty: number;
  } | null>('poolStats', null);
  const activeCoinTicker = useActiveCoinTicker();
  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('blocks');

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
        <title>{t('head_title')}</title>
      </Helmet>
      <HeaderStat>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </HeaderStat>
      <Content>
        <StatBoxContainer>
          <StatBox
            tooltip={
              <Tooltip>
                <TooltipContent>{t('average_luck_tooltip')}</TooltipContent>
              </Tooltip>
            }
            title={<>{t('average_luck')}&nbsp;</>}
            value={
              statsState.data && <Luck value={statsState.data.averageLuck} />
            }
          />
          <StatBox
            tooltip={
              <Tooltip>
                <TooltipContent>{t('current_luck_tooltip')}</TooltipContent>
              </Tooltip>
            }
            title={t('current_luck')}
            value={
              statsState.data && <Luck value={statsState.data.currentLuck} />
            }
          />
          <StatBox
            title={t('network_hashrate')}
            value={
              statsState.data &&
              `${siFormatter(statsState.data.networkHashrate, { unit: 'H/s' })}`
            }
          />
          <StatBox
            tooltip={
              <Tooltip>
                <TooltipContent>
                  {t('network_difficulty_tooltip')}
                </TooltipContent>
              </Tooltip>
            }
            title={t('network_difficulty')}
            value={
              statsState.data &&
              `${siFormatter(statsState.data.networkDifficulty, { unit: 'H' })}`
            }
          />
        </StatBoxContainer>
        <BlocksSection />
        <Spacer size="lg" />
        <BlocksChart />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
};

export default BlocksPage;
