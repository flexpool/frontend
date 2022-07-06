import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Page } from '@/components/layout/Page';
import { HeaderStat } from '@/components/layout/StatHeader';
import { responsiveRule } from 'src/components/Chart/ChartContainer';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

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
  XYChartScrollbar,
} from 'src/plugins/amcharts';
import { useActiveCoin } from '@/rdx/localSettings/localSettings.hooks';
import { Spacer } from '@/components/layout/Spacer';
import { Content } from '@/components/layout/Content';

import { Skeleton } from '@/components/layout/Skeleton';

import styled, { css } from 'styled-components';
import { CoinLogo } from '@/components/CoinLogo';
import { useLocalizedSiFormatter } from '@/utils/si.utils';

const DurationButton = styled.button<{ selected: boolean }>`
  all: unset;
  padding: 8px 24px;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  border-radius: 20px;

  ${(p) =>
    p.selected &&
    css`
      background-color: rgb(128 128 128 / 15%);
    `}

  &:hover {
    background-color: rgb(128 128 128 / 15%);
  }
`;

type DurationsProps = {
  options: { label: React.ReactNode; value: any }[];
  selected: any;
  onChange: (value: any) => void;
};

const DurationsContainer = styled.div`
  display: inline-block;
  margin-left: auto;
  align-self: end;
  margin-bottom: 34px;

  ${DurationButton} + ${DurationButton} {
    margin-left: 8px;
  }
`;

const Durations = ({ options, onChange, selected }: DurationsProps) => {
  return (
    <DurationsContainer>
      {options.map((option, index) => (
        <DurationButton
          key={index}
          selected={selected === option.value}
          onClick={() => {
            onChange(option.value);
          }}
        >
          {option.label}
        </DurationButton>
      ))}
    </DurationsContainer>
  );
};

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

const ChartMetricsSkeleton = styled(Skeleton)`
  width: 400px;
  height: 120px;
`;

const ChartMetrics = ({
  value,
  unit,
  trend,
  type,
}: {
  value: string;
  unit: string;
  trend: number;
  type: string;
}) => {
  return (
    <ChartMetricsContainer>
      <CurrentMetric>{value}</CurrentMetric>
      <MetricUnit>{unit}</MetricUnit>
      <TrendBadge isTrendingUp={trend >= 0}>
        {trend >= 0 ? <FiArrowUp /> : <FiArrowDown />}{' '}
        {Math.abs(trend * 100).toFixed(2)}% Today
      </TrendBadge>
      <MetricTypeSubtitle>Current {type}</MetricTypeSubtitle>
    </ChartMetricsContainer>
  );
};

const ChartMetricsContainer = styled.div`
  color: var(--text-color);
`;
const CurrentMetric = styled.span`
  font-weight: 600;
  font-size: 90px;
`;
const MetricTypeSubtitle = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  line-height: 17px;
  font-weight: 700;
  color: #4a4a4a;
  padding-left: 4px;
  position: relative;
  top: -6px;
`;
const MetricUnit = styled.span`
  font-weight: 600;
  font-size: 42px;
`;
const TrendBadge = styled.span<{ isTrendingUp: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  top: -10px;
  position: relative;
  color: ${(p) => (p.isTrendingUp ? 'var(--success)' : 'var(--danger)')};
  padding: 8px 16px;
  background-color: ${(p) => (p.isTrendingUp ? '#15cd7221' : '#ed4f3221')};
  border-radius: 8px;
  font-size: 16px;
  margin-left: 18px;
`;

type CoinHeaderProps = {
  ticker: string | null | undefined;
  name: string | null | undefined;
};

const CoinName = styled.h1`
  all: unset;
  margin-left: 10px;
  font-size: 36px;
  font-weight: 600;
`;

const CoinTicker = styled.h2`
  all: unset;
  text-transform: uppercase;
  margin-left: 10px;
  font-size: 36px;
  font-weight: 500;
  color: #4a4a4a;
`;

const CoinHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CoinHeaderSkeleton = styled(Skeleton)`
  height: 48px;
  width: 260px;
`;

const CoinHeader = ({ ticker, name }: CoinHeaderProps) => {
  if (!ticker || !name) return <CoinHeaderSkeleton />;

  return (
    <CoinHeaderContainer>
      <CoinLogo size="xl" ticker={ticker} />

      <CoinName>{name}</CoinName>

      <CoinTicker>{ticker}</CoinTicker>
    </CoinHeaderContainer>
  );
};

const DifficultyPage = () => {
  const activeCoin = useActiveCoin();

  const [duration, setDuration] = useState('1d');

  const formatter = useLocalizedSiFormatter();

  const chainStatsHistoryQuery = useChainStatsHistoryQuery(
    {
      coin: activeCoin?.ticker,
      duration: DurationQueryParams[duration].duration,
      period: DurationQueryParams[duration].period,
    },
    {
      keepPreviousData: true,
    }
  );

  const { data: monthlyStats } = useChainStatsHistoryQuery(
    {
      coin: activeCoin?.ticker,
      duration: 'month',
      period: '1d',
    },
    {
      keepPreviousData: true,
    }
  );

  let difficultyTrend: number | null = null;
  if (monthlyStats) {
    const delta = monthlyStats[0].difficulty - monthlyStats[1].difficulty;
    difficultyTrend = delta / monthlyStats[1].difficulty;
  }

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
  }, [chainStatsHistoryQuery, activeCoin]);

  let metricValue: string | null = null;
  let metricUnit: string | null = null;

  if (monthlyStats) {
    const currentDifficulty = monthlyStats[0].difficulty;
    const formattedDifficulty = formatter(currentDifficulty, {
      decimals: 2,
    });

    if (formattedDifficulty) {
      const [value, unit] = formattedDifficulty.split(' ');

      metricValue = value;

      if (activeCoin?.ticker === 'xch') {
        metricUnit = unit + 'PT';
      } else {
        metricUnit = unit + activeCoin?.hashrateUnit.split('/')[0];
      }
    }
  }

  return (
    <Page>
      <HeaderStat>
        <h1>Network Difficulty</h1>
      </HeaderStat>
      <Content>
        <Spacer size="lg" />
        <ChartCard>
          <ChartHeaderRow>
            <CoinHeader
              name={activeCoin?.name as string}
              ticker={activeCoin?.ticker}
            />
          </ChartHeaderRow>
          <Spacer size="md" />
          <ChartHeaderRow>
            {(!metricValue || !metricUnit || !difficultyTrend) && (
              <ChartMetricsSkeleton />
            )}
            {metricValue && metricUnit && difficultyTrend && (
              <ChartMetrics
                value={metricValue}
                unit={metricUnit}
                trend={difficultyTrend}
                type="Difficulty"
              />
            )}

            <Durations
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
          <div
            id="difficultyChart"
            style={{ width: '100%', height: '400px' }}
          />
        </ChartCard>
        <Spacer size="lg" />
        <Spacer size="lg" />
      </Content>
    </Page>
  );
};

export default DifficultyPage;

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
