import React from 'react';

import {
  useActiveCoin,
  useActiveCoinTicker,
  useAppTheme,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useDispatch } from 'react-redux';
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
  ColumnSeries,
  LineSeries,
  XYChartScrollbar,
} from 'src/plugins/amcharts';
import { useTranslation } from 'react-i18next';
import { blocksChartGet } from 'src/rdx/blocksChart/blocksChart.actions';

export const BlocksChart = () => {
  const activeCoin = useActiveCoin();
  const activeCoinTicker = useActiveCoinTicker();
  const blocksChartState = useReduxState('blocksChart');
  const { t } = useTranslation('blocks');

  const d = useDispatch();
  React.useEffect(() => {
    d(blocksChartGet(activeCoinTicker));
  }, [activeCoinTicker, d]);

  const appTheme = useAppTheme();

  React.useLayoutEffect(() => {
    if (blocksChartState.data.length > 1 && activeCoin) {
      let x = create('blocksChart', XYChart);

      x.colors.list = [color('#a6b0c1'), color('#0069ff')];

      x.responsive.enabled = true;
      x.responsive.useDefault = false;
      x.responsive.rules.push(responsiveRule);

      const data = blocksChartState.data.map((item) => ({
        date: new Date(item.timestamp * 1000),
        difficulty: item.difficulty,
        blockCount: item.blockCount,
        rewards: item.rewards / Math.pow(10, activeCoin.decimalPlaces),
      }));

      const difficultyAxis = x.yAxes.push(new ValueAxis());
      difficultyAxis.numberFormatter = new NumberFormatter();
      difficultyAxis.numberFormatter.numberFormat = '#.0 aH';
      difficultyAxis.renderer.grid.template.disabled = true;
      difficultyAxis.renderer.opposite = true;
      const blockCountAxis = x.yAxes.push(new ValueAxis());
      blockCountAxis.numberFormatter = new NumberFormatter();
      blockCountAxis.renderer.grid.template.disabled = true;

      x.data = data.reverse();

      let dateAxis = x.xAxes.push(new DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let difficultySeries = x.series.push(new LineSeries());
      difficultySeries.dataFields.dateX = 'date';
      difficultySeries.name = t('chart.difficulty');
      difficultySeries.yAxis = difficultyAxis;
      difficultySeries.dataFields.valueY = 'difficulty';
      difficultySeries.tooltipText = `{valueY.value.formatNumber("#.00 aH")}`;
      difficultySeries.strokeWidth = 2;
      difficultySeries.tensionX = 0.9;
      difficultySeries.tensionY = 0.9;

      let blockCountSeries = x.series.push(new ColumnSeries());
      blockCountSeries.dataFields.dateX = 'date';
      blockCountSeries.name = t('chart.blocks_per_day');
      blockCountSeries.yAxis = blockCountAxis;
      blockCountSeries.dataFields.valueY = 'blockCount';
      blockCountSeries.tooltipText = `{valueY.value}`;

      x.cursor = new XYCursor();

      let scrollbarX = new XYChartScrollbar();
      scrollbarX.series.push(difficultySeries);
      scrollbarX.strokeWidth = 0;
      scrollbarX.marginBottom = 40;
      if (appTheme === 'dark') {
        scrollbarX.background.fill = color('rgba(255,255,255,0.15)');
        scrollbarX.unselectedOverlay.fill = color('rgba(0,0,0,0.5)');
      } else {
        scrollbarX.background.fill = color('rgba(200,200,200,0.1)');
        scrollbarX.unselectedOverlay.fill = color('rgba(128,128,128,0.2)');
      }
      scrollbarX.thumb.background.fill = color('#67dcab');
      x.scrollbarX = scrollbarX;

      x.legend = new Legend();

      return () => {
        x.dispose();
      };
    }
  }, [blocksChartState.data, appTheme, t, activeCoin]);

  return (
    <ChartContainer dataState={blocksChartState} title={t('chart.title')}>
      <div id="blocksChart" style={{ width: '100%', height: '500px' }}></div>
    </ChartContainer>
  );
};
