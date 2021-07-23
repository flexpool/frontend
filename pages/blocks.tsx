import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import { Content } from '../src/components/layout/Content';
import { HeaderStat } from '../src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from '../src/components/StatBox';
import { BlocksSection } from '../src/sections/Blocks.section';
import { Luck } from '../src/components/Luck';
import { Page } from '../src/components/layout/Page';
import { Spacer } from '../src/components/layout/Spacer';
import { Tooltip, TooltipContent } from '../src/components/Tooltip';
import { BlocksChart } from '../src/pages/Blocks/components/BlocksChart/Blocks.chart';

// Hooks and Utils
import { useAsyncState } from '../src/hooks/useAsyncState';
import { fetchApi } from '../src/utils/fetchApi';
import { useLocalizedSiFormatter } from '../src/utils/si.utils';
import { useActiveCoin } from '../src/rdx/localSettings/localSettings.hooks';

function BlocksPage() {
  const statsState = useAsyncState<{
    averageLuck: number;
    currentLuck: number;
    networkHashrate: number;
    networkDifficulty: number;
  } | null>('poolStats', null);
  const activeCoin = useActiveCoin();
  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('blocks');

  return (
    <Page>
      {/* <Helmet>
        <title>{t('head_title')}</title>
      </Helmet> */}
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
            title={
              activeCoin?.hashrateUnit === 'B'
                ? t('network_space')
                : t('network_hashrate')
            }
            value={
              statsState.data &&
              `${siFormatter(
                statsState.data.networkHashrate *
                  Number(activeCoin?.difficultyFactor),
                {
                  unit:
                    activeCoin?.hashrateUnit === 'H'
                      ? 'H/s'
                      : activeCoin?.hashrateUnit,
                }
              )}`
            }
          />
          <StatBox
            tooltip={
              <Tooltip>
                <TooltipContent>
                  {String(activeCoin?.ticker) === 'xch'
                    ? t('network_difficulty_tooltip_points')
                    : t('network_difficulty_tooltip')}
                </TooltipContent>
              </Tooltip>
            }
            title={t('network_difficulty')}
            value={
              statsState.data &&
              `${siFormatter(statsState.data.networkDifficulty, {
                unit:
                  String(activeCoin?.ticker) === 'xch'
                    ? 'PT'
                    : activeCoin?.hashrateUnit.split('/')[0],
              })}`
            }
          />
        </StatBoxContainer>
        <Spacer />
        <BlocksChart />
        <BlocksSection />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
}

export default BlocksPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'blocks'])),
    },
  };
}
