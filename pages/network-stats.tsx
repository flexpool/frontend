import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Page } from '@/components/layout/Page';
import { HeaderStat } from '@/components/layout/StatHeader';

import {
  ChartMetrics,
  ChartCoin,
  ChartDurationPicker,
  ChartMetricsSkeleton,
  StatsChart,
} from '@/pages/ChainStats/components';
import { DurationKey } from '@/pages/ChainStats/hooks/useNetworkStatsChartData';
import { DURATION_OPTIONS } from '@/pages/ChainStats/constants';

import { Card } from '@/components/layout/Card';

const ChartCard = styled(Card)`
  padding: 36px 36px 22px;
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

const ChartCoinSkeleton = styled(Skeleton)`
  height: 48px;
  width: 200px;
  margin: 0;
`;

const NetworkStatsPage = () => {
  const activeCoin = useActiveCoin();
  const firstRender = useRef(true);

  const [coin, setCoin] = useCoinTicker();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.pathname === '/network-stats') {
      if (router.query?.coin !== coin) {
        if (firstRender.current && router.query?.coin) {
          setCoin(router.query.coin as string);
          firstRender.current = false;
        } else {
          const urlSearchParams = new URLSearchParams({ coin });
          router.replace(
            {
              query: urlSearchParams.toString(),
            },
            undefined,
            { shallow: true }
          );
        }
      } else {
        firstRender.current = false;
      }
    }
  }, [router, coin, setCoin]);

  // TODO: save user preference to local storage
  const [duration, setDuration] = useState<DurationKey>('1m');

  const chartUnit =
    String(activeCoin?.ticker) === 'xch'
      ? 'PT'
      : activeCoin?.hashrateUnit.split('/')[0];

  return (
    <Page>
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
              </ChartHeaderRow>
              <Spacer size="md" />
              <ChartHeaderRow>
                <ChartMetrics type="Difficulty" coin={activeCoin?.ticker} />
                <ChartDurationPicker
                  options={DURATION_OPTIONS}
                  selected={duration}
                  onChange={(value) => {
                    setDuration(value);
                  }}
                />
              </ChartHeaderRow>
              <Spacer />
              <StatsChart
                coin={activeCoin.ticker}
                unit={chartUnit || ''}
                duration={duration}
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
