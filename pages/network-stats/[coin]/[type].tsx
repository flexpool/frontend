import React, { useEffect, useRef, useState } from 'react';
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
  Headline,
} from '@/pages/ChainStats/components';
import { ChartType } from '@/pages/ChainStats/types';
import { Card } from '@/components/layout/Card';
import { DurationKey } from '@/pages/ChainStats/hooks/useNetworkStatsChartData';
import { DURATION_OPTIONS } from '@/pages/ChainStats/constants';
import {
  getReadableChartType,
  getUnitByChartType,
} from '@/pages/ChainStats/utils';

import {
  useActiveCoin,
  useCoinTicker,
} from '@/rdx/localSettings/localSettings.hooks';
import { Spacer } from '@/components/layout/Spacer';
import { Skeleton } from '@/components/layout/Skeleton';
import { Content } from '@/components/layout/Content';
import useNextQueryParams from '@/hooks/useNextQueryParams';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

const RelatedLinkWrapper = styled.div`
  margin-top: 20px;
`;

const RelatedLink: React.FC<{
  href: string;
  children: any;
}> = ({ children, href }) => {
  return (
    <RelatedLinkWrapper>
      <Link href={href}>{children}</Link>
    </RelatedLinkWrapper>
  );
};

const RelatedChartTypeLink: React.FC<{
  activeTypeQuery: string;
  targetTypeQuery: ChartType;
  seoT: any;
  commonT: any;
  coinQuery: string;
  coinName: string;
  hashrateUnit: string;
}> = ({
  activeTypeQuery,
  targetTypeQuery,
  seoT,
  commonT,
  coinQuery,
  coinName,
  hashrateUnit,
}) => {
  return (
    <>
      {activeTypeQuery != targetTypeQuery && (
        <RelatedLink href={`/network-stats/${coinQuery}/${targetTypeQuery}`}>
          {seoT('title.network_stats', {
            coinName,
            coinTicker: coinQuery.toUpperCase(),
            chartType: getReadableChartType(
              commonT,
              targetTypeQuery,
              coinQuery,
              hashrateUnit
            ),
          })}
        </RelatedLink>
      )}
    </>
  );
};

const NetworkStatsPage = ({ coinName }: { coinName: string }) => {
  const [values, setValues] = useNextQueryParams('duration');
  const activeCoin = useActiveCoin();
  const firstRender = useRef(true);
  const { i18n, t: seoT } = useTranslation('seo');
  const { t } = useTranslation('network-stats');
  const { t: commonT } = useTranslation('common');
  const [coin, setCoin] = useCoinTicker();
  const router = useRouter();

  const [typeQuery, setTypeQuery] = useState(router.query.type as ChartType);
  const [coinQuery, setCoinQuery] = useState(router.query.coin as string);

  if (router.query.type && router.query.type !== typeQuery) {
    setTypeQuery(router.query.type as ChartType);
  }

  if (router.query.coin && router.query.coin !== coinQuery) {
    setCoinQuery(router.query.coin as string);
  }

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
            shallow: false,
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

  // TODO: Do not determine the hashrate unit here. Use the hashrate unit field from
  // the API coins response.
  const hashrateUnit = coinQuery === 'xch' ? 'B' : 'H';

  const duration = (values?.duration || '1m') as DurationKey;
  const chartType = getReadableChartType(
    commonT,
    typeQuery,
    coinQuery,
    hashrateUnit
  );

  const metaTitle = seoT('title.network_stats', {
    coinName,
    coinTicker: coinQuery.toUpperCase(),
    chartType: getReadableChartType(
      commonT,
      typeQuery,
      coinQuery,
      hashrateUnit
    ),
  });

  return (
    <Page>
      <NextSeo
        title={metaTitle}
        description={seoT('website_description.network_stats', {
          coinName,
          coinTicker: coinQuery.toUpperCase(),
        })}
        openGraph={{
          title: metaTitle,
          description: seoT('website_description.network_stats', {
            coinName,
            coinTicker: coinQuery.toUpperCase(),
          }),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.network_stats', {
              coinName,
              coinTicker: coin,
              chartType: commonT(chartType as ChartType).toLowerCase(),
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
                  commonT={commonT}
                  onSelect={handleChartTypeSelect}
                  value={typeQuery}
                  coin={activeCoin.ticker}
                  hashrateUnit={hashrateUnit}
                />
              </ChartHeaderRow>
              <Spacer size="md" />
              <ChartSubHeaderRow>
                <ChartMetrics
                  commonT={commonT}
                  type={typeQuery}
                  coin={activeCoin}
                  duration={duration}
                  hashrateUnit={hashrateUnit}
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
        {activeCoin ? (
          <Headline
            metaTitle={metaTitle}
            type={typeQuery}
            coin={activeCoin}
            duration={duration}
          />
        ) : null}

        <h1>{t('faq.difficulty.title')}</h1>
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
              <td>k</td>
              <td>1000</td>
            </tr>
            <tr>
              <td>M</td>
              <td>1000 k</td>
            </tr>
            <tr>
              <td>G</td>
              <td>1000 M</td>
            </tr>
            <tr>
              <td>T</td>
              <td>1000 G</td>
            </tr>
            <tr>
              <td>P</td>
              <td>1000 T</td>
            </tr>
            <tr>
              <td>E</td>
              <td>1000 P</td>
            </tr>
          </tbody>
        </table>

        <h1>{t('faq.blocktime.title')}</h1>
        <p>{t('faq.blocktime.content')}</p>

        <h1>{t('faq.hashrate.title')}</h1>
        <p>
          <Trans
            t={t}
            i18nKey="faq.hashrate.content"
            components={{
              code: <code />,
            }}
          />
        </p>
        <Spacer size="md" />
        <RelatedChartTypeLink
          activeTypeQuery={typeQuery}
          targetTypeQuery={'difficulty'}
          seoT={seoT}
          commonT={commonT}
          coinQuery={coinQuery}
          coinName={coinName}
          hashrateUnit={hashrateUnit}
        />
        <RelatedChartTypeLink
          activeTypeQuery={typeQuery}
          targetTypeQuery={'hashrate'}
          seoT={seoT}
          commonT={commonT}
          coinQuery={coinQuery}
          coinName={coinName}
          hashrateUnit={hashrateUnit}
        />
        <RelatedChartTypeLink
          activeTypeQuery={typeQuery}
          targetTypeQuery={'blocktime'}
          seoT={seoT}
          commonT={commonT}
          coinQuery={coinQuery}
          coinName={coinName}
          hashrateUnit={hashrateUnit}
        />

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
        'dashboard',
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
