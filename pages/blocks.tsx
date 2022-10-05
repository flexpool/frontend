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
import { useLocalizedSiFormatter } from '../src/utils/si.utils';
import useNextPoWRound from '@/hooks/useNextPoWRound';
import useIsMounted from '@/hooks/useIsMounted';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from '../src/rdx/localSettings/localSettings.hooks';
import { usePoolAverageLuckQuery } from '@/hooks/api/usePoolAverageLuck';
import { usePoolCurrentLuck } from '@/hooks/api/usePoolCurrentLuck';
import { usePoolNetworkHashrate } from '@/hooks/api/usePoolNetworkHashrate';
import { usePoolNetworkDifficulty } from '@/hooks/api/usePoolNetworkDifficulty';

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
  const activeCoin = useActiveCoin();
  // Use this hook to get ticker immediately
  const activeCoinTicker = useActiveCoinTicker();
  const siFormatter = useLocalizedSiFormatter();
  const { t, i18n } = useTranslation('blocks');
  const { t: seoT } = useTranslation('seo');
  const isMounted = useIsMounted();

  const isZil = isMounted ? activeCoinTicker === 'zil' : false;

  const averageLuck = usePoolAverageLuckQuery(
    { coin: activeCoinTicker },
    {
      enabled: isMounted && activeCoinTicker !== 'zil',
    }
  );

  const currentLuck = usePoolCurrentLuck(
    {
      coin: activeCoinTicker,
    },
    {
      enabled: isMounted && activeCoinTicker !== 'zil',
    }
  );

  const networkHashrate = usePoolNetworkHashrate(
    {
      coin: activeCoinTicker,
    },
    {
      enabled: isMounted && activeCoinTicker !== 'zil',
    }
  );

  const networkDifficulty = usePoolNetworkDifficulty({
    coin: activeCoinTicker,
  });

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
                averageLuck.isLoading || !averageLuck.data ? undefined : (
                  <Luck value={averageLuck.data} />
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
                currentLuck.isLoading || !currentLuck.data ? undefined : (
                  <Luck value={currentLuck.data} />
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
                networkHashrate.isLoading || !networkHashrate.data
                  ? undefined
                  : `${siFormatter(
                      networkHashrate.data *
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
              networkDifficulty.isLoading || !networkDifficulty.data
                ? undefined
                : `${siFormatter(networkDifficulty.data, {
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

        {!isZil && <DynamicBlocksChart />}

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
