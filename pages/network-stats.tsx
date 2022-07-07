import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Page } from '@/components/layout/Page';
import { HeaderStat } from '@/components/layout/StatHeader';
import { responsiveRule } from 'src/components/Chart/ChartContainer';

import {
  ChartMetrics,
  ChartCoin,
  ChartDurationPicker,
  ChartMetricsSkeleton,
} from '@/pages/ChainStats/components';

import { LoaderSpinner } from '@/components/Loader/LoaderSpinner';

import useChainStatsHistoryQuery from '@/hooks/api/useChainStatsHistoryQuery';

import { Card } from '@/components/layout/Card';

const ChartCard = styled(Card)`
  padding: 36px 36px 22px;
`;

import {
  color,
  NumberFormatter,
  create,
  XYChart,
  XYCursor,
  DateAxis,
  ValueAxis,
  LineSeries,
} from 'src/plugins/amcharts';
import { useActiveCoin } from '@/rdx/localSettings/localSettings.hooks';
import { Spacer } from '@/components/layout/Spacer';
import { Skeleton } from '@/components/layout/Skeleton';
import { Content } from '@/components/layout/Content';

import styled, { keyframes } from 'styled-components';

const DurationQueryParams = {
  '1d': {
    duration: 'day',
    period: '10m',
  },
  '1w': {
    duration: 'week',
    period: '4h',
  },
  '1m': {
    duration: 'month',
    period: '4h',
  },
  '1y': {
    duration: 'year',
    period: '1d',
  },
  all: {
    duration: 'all',
    period: '1w',
  },
};

const ChartHeaderRow = styled.div`
  display: flex;
`;

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ChartLoader = styled(LoaderSpinner)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: ${appear} 0.1s linear;
  animation-fill-mode: forwards;
  animation-delay: 0.15s;
`;

const ChartCoinSkeleton = styled(Skeleton)`
  height: 48px;
  width: 200px;
  margin: 0;
`;

const NetworkStatsPage = () => {
  const activeCoin = useActiveCoin();

  useEffect(() => {
    console.log('activeCoin changed', activeCoin);
  }, [activeCoin]);

  // TODO: save user preference to local storage
  const [duration, setDuration] = useState('1m');

  const chainStatsHistoryQuery = useChainStatsHistoryQuery({
    coin: activeCoin?.ticker,
    duration: DurationQueryParams[duration].duration,
    period: DurationQueryParams[duration].period,
  });

  useEffect(() => {
    if (!chainStatsHistoryQuery.data) return;

    if (chainStatsHistoryQuery.data.length > 1 && activeCoin) {
      let chart = create('difficultyChart', XYChart);

      chart.colors.list = [color('#0069ff')];

      chart.responsive.enabled = true;
      chart.responsive.useDefault = false;
      chart.responsive.rules.push(responsiveRule);

      //account for local timezone offset to utc date
      var userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
      const data = chainStatsHistoryQuery.data.map((item) => ({
        //needs to be end of day for chart to work properly
        date: new Date(item.timestamp * 1000 + userTimezoneOffset),
        difficulty: item.difficulty,
        blockCount: item.blockCount,
      }));

      chart.data = data.reverse();

      let dateAxis = chart.xAxes.push(new DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      const difficultyAxis = chart.yAxes.push(new ValueAxis());

      difficultyAxis.numberFormatter = new NumberFormatter();
      difficultyAxis.numberFormatter.numberFormat =
        `#.0 a'` +
        (String(activeCoin?.ticker) === 'xch'
          ? 'PT'
          : activeCoin?.hashrateUnit.split('/')[0]) +
        `'`;

      difficultyAxis.renderer.grid.template.disabled = true;
      difficultyAxis.renderer.opposite = true;

      let difficultySeries = chart.series.push(new LineSeries());
      difficultySeries.fillOpacity = 0.3;

      difficultySeries.dataFields.dateX = 'date';
      difficultySeries.name = 'Difficulty';
      difficultySeries.yAxis = difficultyAxis;
      difficultySeries.dataFields.valueY = 'difficulty';
      difficultySeries.tooltipText =
        'Difficulty' +
        `: {valueY.value.formatNumber("#.00 a'` +
        (String(activeCoin?.ticker) === 'xch'
          ? 'PT'
          : activeCoin?.hashrateUnit.split('/')[0]) +
        `'")}`;

      difficultySeries.strokeWidth = 2;
      difficultySeries.tensionX = 0.9;
      difficultySeries.tensionY = 0.9;

      chart.cursor = new XYCursor();

      return () => {
        chart.dispose();
      };
    }
  }, [chainStatsHistoryQuery.data, activeCoin]);

  let chartOpacity = chainStatsHistoryQuery.isFetching ? 0.5 : 1;
  if (!activeCoin) chartOpacity = 0;

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
                  options={[
                    {
                      label: '1D',
                      value: '1d',
                    },
                    {
                      label: '1W',
                      value: '1w',
                    },
                    {
                      label: '1M',
                      value: '1m',
                    },
                    {
                      label: '1Y',
                      value: '1y',
                    },
                    {
                      label: 'ALL',
                      value: 'all',
                    },
                  ]}
                  selected={duration}
                  onChange={(value) => {
                    setDuration(value);
                  }}
                />
              </ChartHeaderRow>
              <Spacer />
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
            </>
          )}

          <div style={{ position: 'relative' }}>
            {(chainStatsHistoryQuery.isFetching || !activeCoin) && (
              <ChartLoader />
            )}
            <div
              id="difficultyChart"
              style={{
                width: '100%',
                height: '400px',
                opacity: chartOpacity,
              }}
            />
          </div>
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
