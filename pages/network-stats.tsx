import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Page } from '@/components/layout/Page';
import { HeaderStat } from '@/components/layout/StatHeader';

import {
  ChartMetrics,
  ChartCoin,
  ChartDurationPicker,
  ChartMetricsSkeleton,
  StatsChart,
  ChartTypeSelect,
  ChartType,
} from '@/pages/ChainStats/components';
import { Card } from '@/components/layout/Card';
import { DurationKey } from '@/pages/ChainStats/hooks/useNetworkStatsChartData';
import { DURATION_OPTIONS } from '@/pages/ChainStats/constants';
import { getUnitByChartType } from '@/pages/ChainStats/utils';

import {
  useActiveCoin,
  useCoinTicker,
} from '@/rdx/localSettings/localSettings.hooks';
import { Spacer } from '@/components/layout/Spacer';
import { Skeleton } from '@/components/layout/Skeleton';
import { Content } from '@/components/layout/Content';
import useNextQueryParams from '@/hooks/useNextQueryParams';

const ChartCard = styled(Card)`
  padding: 36px 36px 22px;

  @media screen and (max-width: 768px) {
    padding: 22px 22px 22px;
  }
`;

const ChartHeaderRow = styled.div`
  display: flex;
`;

const ChartSubHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ChartCoinSkeleton = styled(Skeleton)`
  height: 48px;
  width: 200px;
  margin: 0;
`;

const NetworkStatsPage = () => {
  const [values, setValues] = useNextQueryParams('duration', 'type', 'coin');

  const activeCoin = useActiveCoin();
  const firstRender = useRef(true);
  const { i18n, t: seoT } = useTranslation('seo');
  const { t } = useTranslation('network-stats');

  const [coin, setCoin] = useCoinTicker();

  useEffect(() => {
    if (typeof values !== 'undefined' && firstRender.current) {
      if (!values.coin) {
        setValues({ coin });
      } else {
        setCoin(values.coin);
      }

      firstRender.current = false;
    }
  }, [coin, setCoin, values, setValues]);

  if (values && values.coin !== coin && !firstRender.current) {
    setValues({ coin });
  }

  const handleDurationChange = (value) => {
    setValues({ duration: value });
  };

  const handleChartTypeSelect = (value) => {
    setValues({ type: value });
  };

  const duration = (values?.duration || '1m') as DurationKey;
  const chartType = (values?.type || 'difficulty') as ChartType;

  return (
    <Page>
      <NextSeo
        title={seoT('title.network_stats')}
        description={seoT('website_description.network_stats')}
        openGraph={{
          title: seoT('title.network_stats'),
          description: seoT('website_description.network_stats'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.network_stats'),
          },
        ]}
      />

      <HeaderStat>
        <h1>{t('title')}</h1>
      </HeaderStat>
      <Content>
        <Spacer size="lg" />

        <ChartCard>
          {activeCoin ? (
            <>
              <ChartHeaderRow>
                <ChartCoin
                  name={activeCoin?.name as string}
                  ticker={activeCoin?.ticker}
                />
                <ChartTypeSelect
                  onSelect={handleChartTypeSelect}
                  value={chartType}
                />
              </ChartHeaderRow>
              <Spacer size="md" />
              <ChartSubHeaderRow>
                <ChartMetrics
                  type={chartType}
                  coin={activeCoin}
                  duration={duration}
                />
                <ChartDurationPicker
                  options={DURATION_OPTIONS}
                  selected={duration}
                  onChange={handleDurationChange}
                />
              </ChartSubHeaderRow>
              <Spacer />
              <StatsChart
                coin={activeCoin.ticker}
                unit={getUnitByChartType(chartType, activeCoin)}
                duration={duration}
                type={chartType}
              />
            </>
          ) : (
            <>
              <ChartHeaderRow>
                <ChartCoinSkeleton />
              </ChartHeaderRow>
              <Spacer size="md" />
              <ChartHeaderRow>
                <ChartMetricsSkeleton />
              </ChartHeaderRow>
              <div style={{ height: '400px' }} />
            </>
          )}
        </ChartCard>
        <Spacer size="lg" />
        <Spacer size="lg" />
      </Content>
    </Page>
  );
};

export default NetworkStatsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'network-stats',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}
