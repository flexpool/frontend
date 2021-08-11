import React from 'react';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { Spacer } from '../src/components/layout/Spacer';
import { HeaderStat } from '../src/components/layout/StatHeader';
import { Luck } from '../src/components/Luck';
import { StatBox, StatBoxContainer } from '../src/components/StatBox';
import { Tooltip, TooltipContent } from '../src/components/Tooltip';
import { LoaderSpinner } from '../src/components/Loader/LoaderSpinner';

import { useDispatch } from 'react-redux';
import { useReduxState } from '../src/rdx/useReduxState';
import { poolStatsGet } from '../src/rdx/poolStats/poolStats.actions';
import {
  useActiveCoinTicker,
  useActiveCoin,
} from '../src/rdx/localSettings/localSettings.hooks';

import {
  useLocalizedNumberFormatter,
  useLocalizedSiFormatter,
} from '../src/utils/si.utils';

function StatisticsPage() {
  const d = useDispatch();

  const activeTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  React.useEffect(() => {
    if (activeTicker) {
      d(poolStatsGet(activeTicker));
    }
  }, [activeTicker, d]);

  const poolStatsState = useReduxState('poolStats');
  const { t, i18n } = useTranslation('statistics');
  const { t: seoT } = useTranslation('seo');
  const siFormatter = useLocalizedSiFormatter();
  const numberFormatter = useLocalizedNumberFormatter();

  return (
    <Page>
      <NextSeo
        title={seoT('title.statistics')}
        description={seoT('website_description.statistics')}
        openGraph={{
          title: seoT('title.statistics'),
          description: seoT('website_description.statistics'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.statistics'),
          },
        ]}
      />
      <HeaderStat>
        <h1>{t('title')}</h1>
      </HeaderStat>
      <Content>
        <StatBoxContainer>
          <StatBox
            title={t(
              activeCoin?.hashrateUnit === 'B' ? 'pool_space' : 'pool_hashrate'
            )}
            value={siFormatter(poolStatsState.data?.hashrate.total, {
              unit: activeCoin?.hashrateUnit,
            })}
          />
          <StatBox
            title={t('average_luck')}
            tooltip={
              <Tooltip>
                <TooltipContent>{t('average_luck_tooltip')}</TooltipContent>
              </Tooltip>
            }
            value={
              poolStatsState.data?.averageLuck && (
                <Luck value={poolStatsState.data?.averageLuck} />
              )
            }
          />
          <StatBox
            title={t('miners')}
            value={
              poolStatsState.data?.minerCount &&
              numberFormatter(poolStatsState.data?.minerCount)
            }
          />
          <StatBox
            title={t('workers')}
            value={
              poolStatsState.data?.workerCount &&
              numberFormatter(poolStatsState.data?.workerCount)
            }
          />
        </StatBoxContainer>
      </Content>
      <Content>
        <DynamicPoolHashrateChart />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
}

export default StatisticsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'statistics',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}

const DynamicPoolHashrateChart = dynamic(
  () =>
    import(
      '../src/pages/Statistics/components/PoolHashRateChart/PoolHashRate.chart'
    ),
  {
    loading: () => (
      <LoaderSpinner center style={{ minHeight: '30rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);
