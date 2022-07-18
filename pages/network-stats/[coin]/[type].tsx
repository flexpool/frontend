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
} from '@/pages/ChainStats/components';
import { ChartType } from '@/pages/ChainStats/types';
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
import { useRouter } from 'next/router';

import { fetchApi } from '@/utils/fetchApi';
import { ApiPoolCoin } from '@/types/PoolCoin.types';

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

const NetworkStatsPage = ({ coinName }: { coinName: string }) => {
  const [values, setValues] = useNextQueryParams('duration');
  const activeCoin = useActiveCoin();
  const firstRender = useRef(true);
  const { i18n, t: seoT } = useTranslation('seo');
  const { t } = useTranslation('network-stats');
  const [coin, setCoin] = useCoinTicker();
  const router = useRouter();

  const typeQuery = router.query.type as ChartType;

  useEffect(() => {
    if (router.isReady && router.route === '/network-stats/[coin]/[type]') {
      if (firstRender.current) {
        setCoin(router.query.coin as string);
      } else if (router.query.coin !== coin) {
        router.replace(
          `/network-stats/${coin}/${router.query.type}`,
          undefined,
          {
            shallow: true,
          }
        );
      }
      firstRender.current = false;
    }
  }, [router, coin, setCoin]);

  const handleDurationChange = (value) => {
    setValues({ duration: value });
  };

  const handleChartTypeSelect = (value) => {
    router.replace(`/network-stats/${coin}/${value}`, undefined, {
      shallow: true,
    });
  };

  const duration = (values?.duration || '1m') as DurationKey;

  return (
    <Page>
      <NextSeo
        title={seoT('title.network_stats')}
        description={seoT('website_description.network_stats', {
          coinName,
        })}
        openGraph={{
          title: seoT('title.network_stats'),
          description: seoT('website_description.network_stats'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.network_stats', {
              coinName,
              coinTicker: coin,
              chartType: typeQuery,
            }),
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
                  value={typeQuery}
                />
              </ChartHeaderRow>
              <Spacer size="md" />
              <ChartSubHeaderRow>
                <ChartMetrics
                  type={typeQuery}
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
                unit={getUnitByChartType(typeQuery, activeCoin)}
                duration={duration}
                type={typeQuery}
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

let coins: ApiPoolCoin[] = [];

export async function getStaticProps({ locale, params }) {
  if (coins.length === 0) {
    coins = await fetchApi('/pool/coins').then((res: any) => res.coins);
  }

  const coin = coins.find((c) => c.ticker === params.coin);

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'network-stats',
        'cookie-consent',
        'seo',
      ])),
      coinName: coin?.name || '',
    },
  };
}

export async function getStaticPaths({ locales }) {
  const coins = ['eth', 'etc', 'xch'];
  const types = ['difficulty', 'hashrate', 'blocktime'];

  let paths: any = [];

  for (let coin of coins) {
    for (let type of types) {
      for (let locale of locales) {
        paths.push({
          params: { coin, type },
          locale,
        });
      }
    }
  }

  return {
    paths,
    fallback: true,
  };
}
