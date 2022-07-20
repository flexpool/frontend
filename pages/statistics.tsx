import React from 'react';
import { NextSeo } from 'next-seo';
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
import usePoolHashrateQuery from '@/hooks/api/usePoolHashrateQuery';
import usePoolAverageLuckQuery from '@/hooks/api/usePoolAverageLuckQuery';
import usePoolMinerCountQuery from '@/hooks/api/usePoolMinerCountQuery';
import usePoolWorkerCountQuery from '@/hooks/api/usePoolWorkerCountQuery';
import {
  useActiveCoinTicker,
  useActiveCoin,
} from '../src/rdx/localSettings/localSettings.hooks';
import {
  useLocalizedNumberFormatter,
  useLocalizedSiFormatter,
} from '../src/utils/si.utils';
import NetworkStatisticsLink from '@/components/NetworkStatisticsLink';

function StatisticsPage() {
  const activeTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();

  const { data: poolHashrate } = usePoolHashrateQuery({ coin: activeTicker });
  const { data: poolAverageLuck } = usePoolAverageLuckQuery({
    coin: activeTicker,
  });
  const { data: poolMinerCount } = usePoolMinerCountQuery({
    coin: activeTicker,
  });
  const { data: poolWorkerCount } = usePoolWorkerCountQuery({
    coin: activeTicker,
  });

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
        <h1>
          {t('title')} <NetworkStatisticsLink />
        </h1>
      </HeaderStat>
      <Content>
        <StatBoxContainer>
          <StatBox
            title={t(
              activeCoin?.hashrateUnit === 'B' ? 'pool_space' : 'pool_hashrate'
            )}
            value={siFormatter(poolHashrate?.total, {
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
            value={poolAverageLuck && <Luck value={poolAverageLuck} />}
          />
          <StatBox
            title={t('miners')}
            value={poolMinerCount && numberFormatter(poolMinerCount)}
          />
          <StatBox
            title={t('workers')}
            value={poolWorkerCount && numberFormatter(poolWorkerCount)}
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
