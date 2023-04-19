import React from 'react';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
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
import { LoaderSpinner } from '../src/components/Loader/LoaderSpinner';

// Hooks and Utils
import { useAsyncState } from '../src/hooks/useAsyncState';
import { fetchApi } from '../src/utils/fetchApi';
import { useLocalizedSiFormatter } from '../src/utils/si.utils';
import useNextPoWRound from '@/hooks/useNextPoWRound';
import useIsMounted from '@/hooks/useIsMounted';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from '../src/rdx/localSettings/localSettings.hooks';

import NetworkStatisticsLink from '@/components/NetworkStatisticsLink';

const PoWTimer = ({ coin }: { coin: string }) => {
  const { t } = useTranslation('blocks');

  const { duration, isAvailable, isInProgress, isLoading } =
    useNextPoWRound(coin);

  if (!isAvailable) return null;

  return (
    <StatBox
      title={t('next_pow')}
      value={
        isLoading ? undefined : isInProgress ? (
          t('in_progress')
        ) : (
          <>
            {duration?.hours ? `${duration.hours} ${t('hr')}` : ''}{' '}
            {`${duration?.minutes} ${t('min')} ${duration?.seconds} ${t(
              'sec'
            )}`}
          </>
        )
      }
    />
  );
};

function BlocksPage() {
  const statsState = useAsyncState<{
    averageLuck: number;
    currentLuck: number;
    networkHashrate: number;
    networkDifficulty: number;
  } | null>('poolStats', null);
  const activeCoin = useActiveCoin();
  // Use this hook to get ticker immediately
  const activeCoinTicker = useActiveCoinTicker();
  const siFormatter = useLocalizedSiFormatter();
  const { t, i18n } = useTranslation('blocks');
  const { t: seoT } = useTranslation('seo');
  const isMounted = useIsMounted();

  React.useEffect(() => {
    if (activeCoin?.ticker) {
      const init = { query: { coin: activeCoin?.ticker } };

      const isZil = activeCoin.ticker === 'zil';

      statsState.start(
        Promise.all([
          ...(!isZil ? [fetchApi<number>('/pool/averageLuck', init)] : [-1]),
          ...(!isZil ? [fetchApi<number>('/pool/currentLuck', init)] : [-1]),
          ...(!isZil
            ? [fetchApi<number>('/pool/networkHashrate', init)]
            : [-1]),
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
    }
    // eslint-disable-next-line
  }, [activeCoin?.ticker]);

  const isZil = isMounted ? activeCoinTicker === 'zil' : false;
  const hideBlockChart = isMounted ? activeCoinTicker === 'zil' : false;

  return (
    <Page>
      <NextSeo
        title={seoT('title.blocks')}
        description={seoT('website_description.blocks')}
        openGraph={{
          title: seoT('title.blocks'),
          description: seoT('website_description.blocks'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.blocks'),
          },
        ]}
      />
      <HeaderStat>
        <h1>
          {t('title')} <NetworkStatisticsLink />
        </h1>
        <p>{t('description')}</p>
      </HeaderStat>
      <Content>
        <StatBoxContainer>
          {!isZil && (
            <StatBox
              tooltip={
                <Tooltip>
                  <TooltipContent>{t('average_luck_tooltip')}</TooltipContent>
                </Tooltip>
              }
              title={<>{t('average_luck')}&nbsp;</>}
              value={
                statsState.isLoading || !statsState.data ? undefined : (
                  <Luck value={statsState.data.averageLuck} />
                )
              }
            />
          )}

          {!isZil && (
            <StatBox
              tooltip={
                <Tooltip>
                  <TooltipContent>{t('current_luck_tooltip')}</TooltipContent>
                </Tooltip>
              }
              title={t('current_luck')}
              value={
                statsState.isLoading || !statsState.data ? undefined : (
                  <Luck value={statsState.data.currentLuck} />
                )
              }
            />
          )}

          {!isZil && (
            <StatBox
              title={
                activeCoin?.hashrateUnit === 'B'
                  ? t('network_space')
                  : t('network_hashrate')
              }
              value={
                statsState.isLoading || !statsState.data
                  ? undefined
                  : `${siFormatter(
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
          )}

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
              statsState.isLoading || !statsState.data
                ? undefined
                : `${siFormatter(statsState.data.networkDifficulty, {
                    unit:
                      String(activeCoin?.ticker) === 'xch'
                        ? 'PT'
                        : activeCoin?.hashrateUnit.split('/')[0],
                  })}`
            }
          />

          <PoWTimer coin={activeCoinTicker} />
        </StatBoxContainer>
        <Spacer />

        {!hideBlockChart && <DynamicBlocksChart />}

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
      ...(await serverSideTranslations(locale, [
        'common',
        'blocks',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}

const DynamicBlocksChart = dynamic<{}>(
  () =>
    import('../src/pages/Blocks/components/BlocksChart/Blocks.chart').then(
      (module) => module.BlocksChart
    ),
  {
    loading: () => (
      <LoaderSpinner center style={{ minHeight: '26rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);
