import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { LoaderSpinner } from '@/components/Loader/LoaderSpinner';
import { responsiveRule } from 'src/components/Chart/ChartContainer';
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

import useNetworkStatsChartData, {
  DurationKey,
} from '../../hooks/useNetworkStatsChartData';
import { ChartType } from '../../types';

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
  animation-delay: 0.2s;
`;

type StatsChartProps = {
  coin: string;
  unit: string;
  duration: DurationKey;
  type: ChartType;
};

export const StatsChart = React.memo(
  ({ coin, unit, duration, type }: StatsChartProps) => {
    const chartRef = useRef<XYChart | null>(null);
    const { t: commonT } = useTranslation('common');

    const { data, isFetching } = useNetworkStatsChartData(coin, duration);

    const AXIS_CONFIG = {
      difficulty: {
        name: commonT('difficulty'),
      },
      hashrate: {
        name: commonT('hashrate'),
      },
      blocktime: {
        name: commonT('blocktime'),
      },
    };

    const XCH_CONFIG = {
      ...AXIS_CONFIG,
      hashrate: {
        name: commonT('hashrate_space'),
      },
    };

    useEffect(() => {
      if (data && !isFetching) {
        chartRef.current = create('difficultyChart', XYChart);

        chartRef.current.colors.list = [color('#0069ff')];

        chartRef.current.responsive.enabled = true;
        chartRef.current.responsive.useDefault = false;
        chartRef.current.responsive.rules.push(responsiveRule);

        chartRef.current.data = data;

        let dateAxis = chartRef.current.xAxes.push(new DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        const difficultyAxis = chartRef.current.yAxes.push(new ValueAxis());

        difficultyAxis.numberFormatter = new NumberFormatter();
        difficultyAxis.numberFormatter.numberFormat = `#.0 a'` + unit;

        difficultyAxis.renderer.grid.template.disabled = true;
        difficultyAxis.renderer.opposite = true;

        let difficultySeries = chartRef.current.series.push(new LineSeries());
        difficultySeries.fillOpacity = 0.3;

        const chartType =
          coin === 'xch' ? XCH_CONFIG[type]?.name : AXIS_CONFIG[type]?.name;

        difficultySeries.dataFields.dateX = 'date';
        difficultySeries.name = chartType;
        difficultySeries.yAxis = difficultyAxis;
        difficultySeries.dataFields.valueY = type;

        difficultySeries.tooltipText =
          chartType + `: {valueY.value.formatNumber("#.0 a'${unit}'")}`;

        difficultySeries.strokeWidth = 2;
        difficultySeries.tensionX = 0.9;
        difficultySeries.tensionY = 0.9;

        chartRef.current.cursor = new XYCursor();
      }
    }, [data, unit, isFetching, type, coin]);

    useEffect(() => {
      return () => {
        chartRef.current?.dispose();
      };
    }, []);

    return (
      <div style={{ position: 'relative' }}>
        {isFetching && <ChartLoader />}
        <div
          id="difficultyChart"
          style={{
            width: '100%',
            height: '400px',
            opacity: isFetching ? 0.4 : 1,
          }}
        />
      </div>
    );
  }
);

export default StatsChart;
