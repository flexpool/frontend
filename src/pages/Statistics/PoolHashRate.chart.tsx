import React, { useRef } from 'react';

import {
  useActiveCoinTicker,
  useAppTheme,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useDispatch } from 'react-redux';
import { poolHashrateGet } from 'src/rdx/poolHashrate/poolHashrate.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';

import {
  color,
  NumberFormatter,
  create,
  Legend,
  XYChart,
  XYCursor,
  DateAxis,
  ValueAxis,
  LineSeries,
} from 'src/plugins/amcharts';
import { useTranslation } from 'react-i18next';

const PoolHashrateChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const activeCoin = useActiveCoinTicker();
  const poolHasrateState = useReduxState('poolHashrate');
  const { t } = useTranslation('statistics');

  const d = useDispatch();
  React.useEffect(() => {
    d(poolHashrateGet(activeCoin));
  }, [activeCoin, d]);

  const appTheme = useAppTheme();

  React.useLayoutEffect(() => {
    if (poolHasrateState.data.length > 1) {
      let x = create('chartdiv', XYChart);

      x.responsive.enabled = true;
      x.responsive.useDefault = false;
      x.responsive.rules.push(responsiveRule);

      x.colors.list = [
        color(appTheme === 'dark' ? '#aaa' : '#000000'),
        color('#edb431'),
        color('#5d42f5'),
        color('#15cd72'),
        color('#ed4f32'),
        color('#0069ff'),
      ];
      var data = [];

      for (var i = 0; i < poolHasrateState.data.length; i++) {
        const item = poolHasrateState.data[i];
        data.push({
          date: new Date(item.timestamp * 1000),
          total: item.total,
          ...item.regions,
        });
      }

      var hashrateAxis = x.yAxes.push(new ValueAxis());
      hashrateAxis.numberFormatter = new NumberFormatter();
      hashrateAxis.renderer.grid.template.disabled = true;
      hashrateAxis.numberFormatter.numberFormat = '#.0 aH/s';
      var minerCountAxis = x.yAxes.push(new ValueAxis());
      minerCountAxis.numberFormatter = new NumberFormatter();
      let dateAxis = x.xAxes.push(new DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.baseInterval = {
        timeUnit: 'minute',
        count: 1,
      };

      x.data = data.reverse();

      let totalHashrateSeries = x.series.push(new LineSeries());
      totalHashrateSeries.dataFields.dateX = 'date';
      totalHashrateSeries.name = t('chart.total_hashrate');
      totalHashrateSeries.yAxis = hashrateAxis;
      totalHashrateSeries.dataFields.valueY = 'total';
      totalHashrateSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.00 aH/s")}`;
      totalHashrateSeries.strokeWidth = 3;
      totalHashrateSeries.smoothing = 'monotoneX';
      // totalHashrateSeries.monotoneX = 0.9;
      // totalHashrateSeries.monotoneY = 0.9;

      for (const region in poolHasrateState.data[0].regions) {
        let hashrateSeries = x.series.push(new LineSeries());
        hashrateSeries.dataFields.dateX = 'date';
        hashrateSeries.name = t(`chart.${region}`);
        hashrateSeries.yAxis = hashrateAxis;
        hashrateSeries.dataFields.valueY = region;
        hashrateSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.00 aH/s")}`;
        hashrateSeries.strokeWidth = 3;
        hashrateSeries.tensionX = 0.9;
        hashrateSeries.tensionY = 0.9;
        hashrateSeries.smoothing = 'monotoneX';
        // hashrateSeries.monotoneX = 0.9;
        // hashrateSeries.monotoneY = 0.9;
      }

      x.cursor = new XYCursor();

      x.legend = new Legend();
      // @ts-ignore
      chartRef.current = x;
      return () => {
        x.dispose();
      };
    }
  }, [poolHasrateState.data, appTheme, t]);

  return (
    <ChartContainer dataState={poolHasrateState} title={t('chart.title')}>
      <div id="chartdiv" style={{ width: '100%', height: '400px' }}></div>
    </ChartContainer>
  );
};
export default PoolHashrateChart;
