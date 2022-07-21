import React from 'react';
import { useTranslation, Trans } from 'next-i18next';
import styled, { css } from 'styled-components';
import { FiArrowDown, FiArrowUp, FiMinus } from 'react-icons/fi';
import { Skeleton } from '@/components/layout/Skeleton';

import { useLocalizedSiFormatter } from '@/utils/si.utils';
import { ChartType } from '../../types';
import { getReadableChartType, getUnitByChartType } from '../../utils';
import useNetworkStatsChartData, {
  DurationKey,
} from '../../hooks/useNetworkStatsChartData';

const ChartMetricsContainer = styled.div`
  color: var(--text-color);
  white-space: nowrap;
`;

const CurrentMetric = styled.span`
  font-weight: 600;
  font-size: 68px;

  @media screen and (max-width: 768px) {
    font-size: 42px;
  }
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

  @media screen and (max-width: 768px) {
    top: 0;
    padding-left: 0px;
  }
`;

const MetricUnit = styled.span`
  font-weight: 600;
  font-size: 42px;

  @media screen and (max-width: 768px) {
    font-size: 28px;
  }
`;

const TrendBadge = styled.span<{ type: 'up' | 'down' | 'stay' }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  top: -8px;
  position: relative;

  ${(p) => {
    if (p.type === 'up') {
      return css`
        background-color: #ed4f3221;
        color: var(--danger);
      `;
    } else if (p.type === 'down') {
      return css`
        background-color: #15cd7221;
        color: var(--success);
      `;
    } else {
      return css`
        background-color: #4a4a4a21;
        color: #4a4a4a;
      `;
    }
  }}

  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  margin-left: 18px;

  @media screen and (max-width: 768px) {
    font-size: 12px;
    padding: 6px 8px;
    top: -5px;
    margin-left: 8px;
  }
`;

export const ChartMetricsSkeleton = styled(Skeleton)`
  width: 340px;
  height: 95.2px;
  margin: 0;
`;

const renderBadgeContent = (trend: number) => {
  let Indicator = FiArrowUp;
  let type = 'up';

  if (Math.abs(trend * 100).toFixed(2) === '0.00') {
    Indicator = FiMinus;
    type = 'stay';
  }
  if (trend < 0) {
    Indicator = FiArrowDown;
    type = 'down';
  }

  return (
    <TrendBadge type={type as any}>
      <Indicator />
      {Math.abs(trend * 100).toFixed(2)}%
    </TrendBadge>
  );
};

export const Headline: React.FC<{
  metaTitle: string;
  coin: { ticker: string; hashrateUnit: string };
  type: ChartType;
  duration: DurationKey;
}> = ({ metaTitle, coin, type, duration }) => {
  const formatter = useLocalizedSiFormatter();

  const { data: currentDurationStats, isLoading } = useNetworkStatsChartData(
    coin.ticker,
    duration
  );

  let metricValue: string | null = null;
  let metricUnit: string | null = null;

  if (currentDurationStats) {
    const currentMetric =
      currentDurationStats[currentDurationStats.length - 1][type];

    const formattedMetric = formatter(currentMetric, {
      decimals: currentMetric >= 10 ? 1 : 2,
    });

    if (formattedMetric) {
      const [value, si] = formattedMetric.split(' ');
      metricValue = value;
      metricUnit = si + getUnitByChartType(type, coin);
    }
  }

  return (
    <div style={{ height: '16px' }}>
      {metricValue && (
        <Trans
          ns="network-stats"
          i18nKey="headline"
          values={{ key: metaTitle, value: `${metricValue} ${metricUnit}` }}
          components={{
            b: <b />,
          }}
        />
      )}
    </div>
  );
};

export const ChartMetrics = ({
  type,
  coin,
  duration,
  hashrateUnit,
}: {
  coin: { ticker: string; hashrateUnit: string };
  type: ChartType;
  duration: DurationKey;
  hashrateUnit: string;
}) => {
  const formatter = useLocalizedSiFormatter();
  const { t: commonT } = useTranslation('common');

  const { data: currentDurationStats, isLoading } = useNetworkStatsChartData(
    coin.ticker,
    duration
  );

  let metricValue: string | null = null;
  let metricUnit: string | null = null;
  let trend: number | null = null;

  if (currentDurationStats) {
    const currentMetric =
      currentDurationStats[currentDurationStats.length - 1][type];
    const previousMetric = currentDurationStats[0][type];

    const formattedMetric = formatter(currentMetric, {
      decimals: currentMetric >= 10 ? 1 : 2,
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
      {trend !== null && renderBadgeContent(trend)}
      <MetricTypeSubtitle>
        {commonT('current_network_value', {
          value: getReadableChartType(commonT, type, hashrateUnit),
        })}
      </MetricTypeSubtitle>
    </ChartMetricsContainer>
  );
};

export default ChartMetrics;
