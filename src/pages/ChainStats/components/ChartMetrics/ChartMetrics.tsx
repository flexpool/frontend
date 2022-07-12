import React from 'react';
import styled from 'styled-components';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import { Skeleton } from '@/components/layout/Skeleton';

import useChainStatsHistoryQuery from '@/hooks/api/useChainStatsHistoryQuery';
import { useLocalizedSiFormatter } from '@/utils/si.utils';
import { ChartType } from '../../types';
import { getUnitByChartType } from '../../utils';

const ChartMetricsContainer = styled.div`
  color: var(--text-color);
`;

const CurrentMetric = styled.span`
  font-weight: 600;
  font-size: 68px;
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

export const ChartMetricsSkeleton = styled(Skeleton)`
  width: 340px;
  height: 95.2px;
  margin: 0;
`;

export const ChartMetrics = ({
  type,
  coin,
}: {
  coin: { ticker: string; hashrateUnit: string };
  type: ChartType;
}) => {
  const formatter = useLocalizedSiFormatter();

  const { data: dailyStats, isLoading } = useChainStatsHistoryQuery(
    {
      coin: coin.ticker,
      duration: 'day',
      period: '10m',
    },
    {
      select: (data) =>
        data.map(({ difficulty, blockTime }) => ({
          difficulty,
          blockTime,
          hashrate: difficulty / blockTime,
        })),
    }
  );

  let metricValue: string | null = null;
  let metricUnit: string | null = null;
  let trend: number | null = null;

  if (dailyStats) {
    const currentMetric = dailyStats[0][type];
    const previousMetric = dailyStats[dailyStats.length - 1][type];

    const formattedMetric = formatter(currentMetric, {
      decimals: 2,
    });

    if (formattedMetric) {
      const [value, si] = formattedMetric.split(' ');
      metricValue = value;
      metricUnit = si + getUnitByChartType(type, coin);
    }

    trend = (currentMetric - previousMetric) / previousMetric;
  }

  if (isLoading) return <ChartMetricsSkeleton />;

  return (
    <ChartMetricsContainer>
      <CurrentMetric>{metricValue}</CurrentMetric>
      <MetricUnit>{metricUnit}</MetricUnit>
      {trend && (
        <TrendBadge isTrendingUp={trend >= 0}>
          {trend >= 0 ? <FiArrowUp /> : <FiArrowDown />}{' '}
          {Math.abs(trend * 100).toFixed(2)}% Today
        </TrendBadge>
      )}

      <MetricTypeSubtitle>Current {type}</MetricTypeSubtitle>
    </ChartMetricsContainer>
  );
};

export default ChartMetrics;
