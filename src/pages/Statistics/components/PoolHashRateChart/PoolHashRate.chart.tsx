import React, { useEffect, useRef } from 'react';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useThemeMode } from '@/context/ThemeModeProvider';
import usePoolHashrateChartQuery from '@/hooks/api/usePoolHashrateChartQuery';
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
import { useTranslation } from 'next-i18next';
import { ApiPoolHashrateItem } from '@/types/PoolHashrate.types';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

type HashrateChartDataItem = {
  date: number;
  total: number;
} & ApiPoolHashrateItem['regions'];

const PoolHashrateChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const activeCoin = useActiveCoin();
  const { t } = useTranslation('statistics');

  const {
    data: poolHashrateChart,
    isLoading,
    error,
  } = usePoolHashrateChartQuery({
    coin: activeCoin?.ticker,
  });

  const { color: themeColor } = useThemeMode();

  // React.useEffect(() => {
  //   if (poolHashrateChart) {
  //     let x = create('chartdiv', XYChart);

  //     x.responsive.enabled = true;
  //     x.responsive.useDefault = false;
  //     x.responsive.rules.push(responsiveRule);

  //     x.colors.list = [color(themeColor === 'dark' ? '#aaa' : '#000000')];

  //     const data: HashrateChartDataItem[] = [];

  //     if (poolHashrateChart.length > 0) {
  //       for (var key in poolHashrateChart[0].regions) {
  //         switch (key) {
  //           case 'eu':
  //             x.colors.list.push(color('#15cd72'));
  //             break;
  //           case 'us':
  //             x.colors.list.push(color('#0069ff'));
  //             break;
  //           case 'as':
  //             x.colors.list.push(color('#edb431'));
  //             break;
  //           case 'au':
  //             x.colors.list.push(color('#5d42f5'));
  //             break;
  //           case 'sa':
  //             x.colors.list.push(color('#ed4f32'));
  //             break;
  //           default:
  //             x.colors.list.push(color('#ccc'));
  //             break;
  //         }
  //       }
  //     }

  //     for (var i = 0; i < poolHashrateChart.length; i++) {
  //       const item = poolHashrateChart[i];
  //       data.push({
  //         date: new Date(item.timestamp * 1000),
  //         total: item.total,
  //         ...item.regions,
  //       });
  //     }

  //     var hashrateAxis = x.yAxes.push(new ValueAxis());
  //     hashrateAxis.numberFormatter = new NumberFormatter();
  //     hashrateAxis.renderer.grid.template.disabled = true;
  //     hashrateAxis.numberFormatter.numberFormat =
  //       "#.0 a'" + activeCoin?.hashrateUnit + "'";
  //     var minerCountAxis = x.yAxes.push(new ValueAxis());
  //     minerCountAxis.numberFormatter = new NumberFormatter();
  //     let dateAxis = x.xAxes.push(new DateAxis());
  //     dateAxis.renderer.grid.template.location = 0;
  //     dateAxis.baseInterval = {
  //       timeUnit: 'minute',
  //       count: 1,
  //     };

  //     x.data = data.reverse();

  //     let totalHashrateSeries = x.series.push(new LineSeries());
  //     totalHashrateSeries.dataFields.dateX = 'date';
  //     totalHashrateSeries.name =
  //       activeCoin?.hashrateUnit === 'B'
  //         ? t('chart.total_space')
  //         : t('chart.total_hashrate');
  //     totalHashrateSeries.yAxis = hashrateAxis;
  //     totalHashrateSeries.dataFields.valueY = 'total';
  //     totalHashrateSeries.tooltipText =
  //       `{name}: {valueY.value.formatNumber("#.00 a'` +
  //       activeCoin?.hashrateUnit +
  //       `'")}`;
  //     totalHashrateSeries.strokeWidth = 3;
  //     totalHashrateSeries.smoothing = 'monotoneX';
  //     // totalHashrateSeries.monotoneX = 0.9;
  //     // totalHashrateSeries.monotoneY = 0.9;

  //     for (const region in poolHashrateChart[0].regions) {
  //       let hashrateSeries = x.series.push(new LineSeries());
  //       hashrateSeries.dataFields.dateX = 'date';
  //       hashrateSeries.name = t(`chart.${region}`);
  //       hashrateSeries.yAxis = hashrateAxis;
  //       hashrateSeries.dataFields.valueY = region;
  //       hashrateSeries.tooltipText =
  //         `{name}: {valueY.value.formatNumber("#.00 a'` +
  //         activeCoin?.hashrateUnit +
  //         `'")}`;
  //       hashrateSeries.strokeWidth = 3;
  //       hashrateSeries.tensionX = 0.9;
  //       hashrateSeries.tensionY = 0.9;
  //       hashrateSeries.smoothing = 'monotoneX';
  //       // hashrateSeries.monotoneX = 0.9;
  //       // hashrateSeries.monotoneY = 0.9;
  //     }

  //     x.cursor = new XYCursor();
  //     x.cursor.maxTooltipDistance = 20;

  //     x.legend = new Legend();
  //     // @ts-ignore
  //     chartRef.current = x;
  //     return () => {
  //       x.dispose();
  //     };
  //   }
  // }, [poolHashrateChart, themeColor, t, activeCoin]);

  useEffect(() => {
    if (!poolHashrateChart) return;

    const root = am5.Root.new('chartdiv_v5');

    root.setThemes([am5themes_Animated.new(root)]);

    const hashrateData: HashrateChartDataItem[] = [];

    for (var i = 0; i < poolHashrateChart.length; i++) {
      const item = poolHashrateChart[i];
      hashrateData.push({
        date: item.timestamp * 1000,
        total: item.total,
        ...item.regions,
      });
    }

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
      })
    );
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        numberFormat: "#.0 a'",
      })
    );

    let yRenderer = yAxis.get('renderer');
    yRenderer.labels.template.setAll({
      fill: am5.color('#ffffff'),
    });

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          stroke: am5.color(themeColor === 'light' ? '#000000' : '#fffff'),
          strokeWidth: 2,
        }),
        tooltip: am5.Tooltip.new(root, {}),
        baseInterval: {
          timeUnit: 'minute',
          count: 1,
        },
      })
    );

    const genSeries = (value) => {
      const s = am5xy.SmoothedXLineSeries.new(root, {
        name: value,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: value,
        valueXField: 'date',
      });

      let series1 = chart.series.push(s);

      series1.strokes.template.setAll({
        strokeWidth: 3,
      });

      series1.data.setAll(hashrateData);

      series1.appear(1000);
    };

    for (const region in poolHashrateChart[0].regions) {
      genSeries(region);
    }

    genSeries('total');

    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'zoomX',
      })
    );

    cursor.lineY.set('visible', false);

    var scrollbar = chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [themeColor, poolHashrateChart]);

  return (
    <>
      {/* <ChartContainer
        dataState={{ data: poolHashrateChart, isLoading, error }}
        title={t(
          activeCoin?.hashrateUnit === 'B' ? 'chart.title_space' : 'chart.title'
        )}
      >
        <div id="chartdiv" style={{ width: '100%', height: '400px' }}></div>
      </ChartContainer> */}

      <ChartContainer>
        <div id="chartdiv_v5" style={{ width: '100%', height: '400px' }}></div>
      </ChartContainer>
    </>
  );
};
export default PoolHashrateChart;
