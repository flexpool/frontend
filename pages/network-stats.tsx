import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
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

const ChartCard = styled(Card)`
  padding: 36px 36px 22px;

  @media screen and (max-width: 768px) {
    padding: 22px 22px 22px;
  }
`;

import {
  useActiveCoin,
  useCoinTicker,
} from '@/rdx/localSettings/localSettings.hooks';
import { Spacer } from '@/components/layout/Spacer';
import { Skeleton } from '@/components/layout/Skeleton';
import { Content } from '@/components/layout/Content';

import styled from 'styled-components';

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
  const activeCoin = useActiveCoin();
  const firstRender = useRef(true);
  const { i18n, t: seoT } = useTranslation('seo');

  const [coin, setCoin] = useCoinTicker();
  const router = useRouter();

  useEffect(() => {
    if (
      router.isReady &&
      router.pathname === '/network-stats' &&
      !firstRender.current &&
      router.query.coin &&
      coin !== router.query.coin
    ) {
      let [queryString] = router.asPath.match(/\?[^#]+/g) || [''];
      const urlSearchParams = new URLSearchParams(queryString);
      urlSearchParams.set('coin', coin);
      router.replace(
        {
          query: urlSearchParams.toString(),
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router, coin]);

  const [duration, setDuration] = useState<DurationKey>('1m');
  const [chartType, setChartType] = useState<ChartType>('difficulty');

  useEffect(() => {
    if (router.isReady && firstRender.current) {
      let [queryString] = router.asPath.match(/\?[^#]+/g) || [''];
      const urlSearchParams = new URLSearchParams(queryString);

      if (!router.query.coin) {
        urlSearchParams.set('coin', coin);
      } else {
        setCoin(router.query.coin as string);
      }

      if (!router.query.duration) {
        urlSearchParams.set('duration', '1m');
      } else {
        setDuration(router.query.duration as DurationKey);
      }

      if (!router.query.type) {
        urlSearchParams.set('type', 'difficulty');
      } else {
        setChartType(router.query.type as ChartType);
      }

      router.replace(
        {
          query: urlSearchParams.toString(),
        },
        undefined,
        { shallow: true }
      );

      firstRender.current = false;
    }
  }, [router, coin, setCoin]);

  const handleDurationChange = (value) => {
    setDuration(value);
    let [queryString] = router.asPath.match(/\?[^#]+/g) || [''];

    const urlSearchParams = new URLSearchParams(queryString);
    urlSearchParams.set('duration', value);

    router.replace(
      {
        query: urlSearchParams.toString(),
      },
      undefined,
      { shallow: true }
    );
  };

  const handleChartTypeSelect = (value) => {
    setChartType(value);
    let [queryString] = router.asPath.match(/\?[^#]+/g) || [''];

    const urlSearchParams = new URLSearchParams(queryString);
    urlSearchParams.set('type', value);

    router.replace(
      {
        query: urlSearchParams.toString(),
      },
      undefined,
      { shallow: true }
    );
  };

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
        <h1>Network Statistics</h1>
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
                <ChartMetrics type={chartType} coin={activeCoin} />
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
        'blocks',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}
