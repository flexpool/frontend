import React from 'react';
import styled from 'styled-components';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import { Skeleton } from '@/components/layout/Skeleton';

import useChainStatsHistoryQuery from '@/hooks/api/useChainStatsHistoryQuery';
import { useLocalizedSiFormatter } from '@/utils/si.utils';
import { useActiveCoin } from '@/rdx/localSettings/localSettings.hooks';
import { ChartType } from '../ChartTypeSelect';

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
  coin: string;
  type: ChartType;
}) => {
  const coinMeta = useActiveCoin(coin);
  const formatter = useLocalizedSiFormatter();
  const { data: monthlyStats, isLoading } = useChainStatsHistoryQuery(
    {
      coin,
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

  if (monthlyStats) {
    const currentMetric = monthlyStats[0][type];
    const formattedMetric = formatter(currentMetric, {
      decimals: 2,
    });

    if (formattedMetric) {
      const [value, unit] = formattedMetric.split(' ');

      metricValue = value;

      switch (type) {
        case 'difficulty':
          if (coinMeta?.ticker === 'xch') {
            metricUnit = unit + 'PT';
          } else {
            metricUnit = unit + coinMeta?.hashrateUnit.split('/')[0];
          }
          break;
        case 'hashrate':
          if (coinMeta?.ticker === 'xch') {
            metricUnit = unit + 'PT/s';
          } else {
            metricUnit = unit + coinMeta?.hashrateUnit.split('/')[0] + '/s';
          }
          break;

        case 'blockTime':
          metricUnit = unit + 'sec';
          break;
      }
    }
  }

  let trend: number | null = null;
  if (monthlyStats) {
    const delta =
      monthlyStats[0][type] - monthlyStats[monthlyStats.length - 1][type];
    trend = delta / monthlyStats[monthlyStats.length - 1][type];
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
