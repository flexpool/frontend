import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import { useTranslation, Trans } from 'next-i18next';
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
        let [queryString] = router.asPath.match(/\?[^#]+/g) || [''];
        const urlSearchParams = new URLSearchParams(queryString);

        router.replace(
          {
            pathname: `/network-stats/${coin}/${router.query.type}`,
            query: urlSearchParams.toString(),
          },
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
    let [queryString] = router.asPath.match(/\?[^#]+/g) || [''];
    const urlSearchParams = new URLSearchParams(queryString);

    router.replace(
      {
        pathname: `/network-stats/${coin}/${value}`,
        query: urlSearchParams.toString(),
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const duration = (values?.duration || '1m') as DurationKey;

  return (
    <Page>
      <NextSeo
        title={seoT('title.network_stats', {
          coinName,
        })}
        description={seoT('website_description.network_stats', {
          coinName,
        })}
        openGraph={{
          title: seoT('title.network_stats', {
            coinName,
          }),
          description: seoT('website_description.network_stats', {
            coinName,
          }),
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
        <h2>{t('faq.difficulty.title')}</h2>
        <p>{t('faq.difficulty.content')}</p>
        <table style={{ maxWidth: 300 }}>
          <thead>
            <tr>
              <th>Unit</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>K</td>
              <td>1000</td>
            </tr>
            <tr>
              <td>M</td>
              <td>1000K</td>
            </tr>
            <tr>
              <td>G</td>
              <td>1000M</td>
            </tr>
            <tr>
              <td>T</td>
              <td>1000G</td>
            </tr>
            <tr>
              <td>P</td>
              <td>1000T</td>
            </tr>
            <tr>
              <td>E</td>
              <td>1000P</td>
            </tr>
          </tbody>
        </table>

        <h2>{t('faq.blocktime.title')}</h2>
        <p>{t('faq.blocktime.content')}</p>

        <h2>{t('faq.hashrate.title')}</h2>
        <p>
          <Trans
            t={t}
            i18nKey="faq.hashrate.content"
            components={{
              code: <code />,
            }}
          />
        </p>

        <Spacer size="sm" />

        <Spacer size="lg" />
        <Spacer size="lg" />
      </Content>
    </Page>
  );
};

export default NetworkStatsPage;

export async function getStaticProps({ locale, params }) {
  const coinNames = {
    eth: 'Ethereum',
    etc: 'Ethereum Classic',
    xch: 'Chia',
  };

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'network-stats',
        'cookie-consent',
        'seo',
      ])),
      coinName: coinNames[params.coin],
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
    fallback: false,
  };
}
