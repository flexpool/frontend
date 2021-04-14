import React, { useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import {
  useActiveCoinTicker,
  useAppTheme,
} from 'src/rdx/localSettings/localSettings.hooks';
import { formatRegionName } from 'src/utils/region.utils';
import { ApiRegion } from 'src/types/Region.types';
import { useDispatch } from 'react-redux';
import { poolHashrateGet } from 'src/rdx/poolHashrate/poolHashrate.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';

const PoolHashrateChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const activeCoin = useActiveCoinTicker();
  const poolHasrateState = useReduxState('poolHashrate');

  const d = useDispatch();
  React.useEffect(() => {
    d(poolHashrateGet(activeCoin));
  }, [activeCoin, d]);

  const appTheme = useAppTheme();

  React.useLayoutEffect(() => {
    if (poolHasrateState.data.length > 1) {
      let x = am4core.create('chartdiv', am4charts.XYChart);

      x.responsive.enabled = true;
      x.responsive.useDefault = false;
      x.responsive.rules.push(responsiveRule);

      x.colors.list = [
        am4core.color(appTheme === 'dark' ? '#aaa' : '#000000'),
        am4core.color('#edb431'),
        am4core.color('#5d42f5'),
        am4core.color('#15cd72'),
        am4core.color('#ed4f32'),
        am4core.color('#0069ff'),
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

      var hashrateAxis = x.yAxes.push(new am4charts.ValueAxis());
      hashrateAxis.numberFormatter = new am4core.NumberFormatter();
      hashrateAxis.renderer.grid.template.disabled = true;
      hashrateAxis.numberFormatter.numberFormat = '#.0 aH/s';
      var minerCountAxis = x.yAxes.push(new am4charts.ValueAxis());
      minerCountAxis.numberFormatter = new am4core.NumberFormatter();
      let dateAxis = x.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.baseInterval = {
        timeUnit: 'minute',
        count: 1,
      };

      x.data = data.reverse();

      let totalHashrateSeries = x.series.push(new am4charts.LineSeries());
      totalHashrateSeries.dataFields.dateX = 'date';
      totalHashrateSeries.name = 'Total Hashrate';
      totalHashrateSeries.yAxis = hashrateAxis;
      totalHashrateSeries.dataFields.valueY = 'total';
      totalHashrateSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.00 aH/s")}`;
      totalHashrateSeries.strokeWidth = 3;
      totalHashrateSeries.smoothing = 'monotoneX';
      // totalHashrateSeries.monotoneX = 0.9;
      // totalHashrateSeries.monotoneY = 0.9;

      for (const region in poolHasrateState.data[0].regions) {
        let hashrateSeries = x.series.push(new am4charts.LineSeries());
        hashrateSeries.dataFields.dateX = 'date';
        hashrateSeries.name = `${formatRegionName(region as ApiRegion)} Region`;
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

      x.cursor = new am4charts.XYCursor();

      x.legend = new am4charts.Legend();
      // @ts-ignore
      chartRef.current = x;
      return () => {
        x.dispose();
      };
    }
  }, [poolHasrateState.data, appTheme]);

  return (
    <ChartContainer dataState={poolHasrateState} title="Pool Hashrate">
      <div id="chartdiv" style={{ width: '100%', height: '400px' }}></div>
    </ChartContainer>
  );
};
export default PoolHashrateChart;

// /**
//  * ---------------------------------------
//  * This demo was created using amCharts 4.
//  *
//  * For more information visit:
//  * https://www.amcharts.com/
//  *
//  * Documentation is available at:
//  * https://www.amcharts.com/docs/v4/
//  * ---------------------------------------
//  */

// am4core.useTheme(am4themes_animated);

// /**
//  * ========================================================
//  * Creating a chart
//  * ========================================================
//  */
// var chart = am4core.create('chartdiv', am4charts.XYChart);

// chart.data = [
//   {
//     year: '1994',
//     cars: 1587,
//     motorcycles: 650,
//     bicycles: 121,
//   },
//   {
//     year: '1995',
//     cars: 1567,
//     motorcycles: 683,
//     bicycles: 146,
//   },
//   {
//     year: '1996',
//     cars: 1617,
//     motorcycles: 691,
//     bicycles: 138,
//   },
//   {
//     year: '1997',
//     cars: 1630,
//     motorcycles: 642,
//     bicycles: 127,
//   },
//   {
//     year: '1998',
//     cars: 1660,
//     motorcycles: 699,
//     bicycles: 105,
//   },
//   {
//     year: '1999',
//     cars: 1683,
//     motorcycles: 721,
//     bicycles: 109,
//   },
//   {
//     year: '2000',
//     cars: 1691,
//     motorcycles: 737,
//     bicycles: 112,
//   },
//   {
//     year: '2001',
//     cars: 1298,
//     motorcycles: 680,
//     bicycles: 101,
//   },
//   {
//     year: '2002',
//     cars: 1275,
//     motorcycles: 664,
//     bicycles: 97,
//   },
//   {
//     year: '2003',
//     cars: 1246,
//     motorcycles: 648,
//     bicycles: 93,
//   },
//   {
//     year: '2004',
//     cars: 1218,
//     motorcycles: 637,
//     bicycles: 101,
//   },
//   {
//     year: '2005',
//     cars: 1213,
//     motorcycles: 633,
//     bicycles: 87,
//   },
//   {
//     year: '2006',
//     cars: 1199,
//     motorcycles: 621,
//     bicycles: 79,
//   },
//   {
//     year: '2007',
//     cars: 1110,
//     motorcycles: 210,
//     bicycles: 81,
//   },
//   {
//     year: '2008',
//     cars: 1165,
//     motorcycles: 232,
//     bicycles: 75,
//   },
//   {
//     year: '2009',
//     cars: 1145,
//     motorcycles: 219,
//     bicycles: 88,
//   },
//   {
//     year: '2010',
//     cars: 1163,
//     motorcycles: 201,
//     bicycles: 82,
//   },
//   {
//     year: '2011',
//     cars: 1180,
//     motorcycles: 285,
//     bicycles: 87,
//   },
//   {
//     year: '2012',
//     cars: 1159,
//     motorcycles: 277,
//     bicycles: 71,
//   },
// ];

// chart.padding(40, 40, 40, 40);

// let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
// categoryAxis.renderer.grid.template.location = 0;
// categoryAxis.dataFields.category = 'year';
// categoryAxis.renderer.minGridDistance = 60;

// let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// let series = chart.series.push(new am4charts.ColumnSeries());
// series.dataFields.categoryX = 'year';
// series.dataFields.valueY = 'cars';
// series.tooltipText = '{name}: {valueY}';
// series.name = 'Cars';
// series.columns.template.focusable = true;
// series.columns.template.hoverOnFocus = true;
// series.columns.template.tooltipText = 'xx {valueY}';

// let series2 = chart.series.push(new am4charts.ColumnSeries());
// series2.dataFields.categoryX = 'year';
// series2.dataFields.valueY = 'motorcycles';
// series2.name = 'Motorcycles';
// series2.tooltipText = '{name}: {valueY}';

// let series3 = chart.series.push(new am4charts.ColumnSeries());
// series3.dataFields.categoryX = 'year';
// series3.dataFields.valueY = 'bicycles';
// series3.name = 'Bicycles';
// series3.tooltipText = '{name}: {valueY}';

// chart.scrollbarX = new am4core.Scrollbar();

// chart.legend = new am4charts.Legend();

// chart.cursor = new am4charts.XYCursor();

// /**
//  * ========================================================
//  * Enabling responsive features
//  * ========================================================
//  */

// chart.responsive.enabled = true;
// chart.responsive.useDefault = false;

// chart.responsive.rules.push({
//   relevant: function (target) {
//     if (target.pixelWidth <= 400) {
//       return true;
//     }

//     return false;
//   },
//   state: function (target, stateId) {
//     if (target instanceof am4charts.Chart) {
//       var state = target.states.create(stateId);
//       state.properties.paddingTop = 0;
//       state.properties.paddingRight = 15;
//       state.properties.paddingBottom = 5;
//       state.properties.paddingLeft = 15;
//       return state;
//     }

//     if (target instanceof am4core.Scrollbar) {
//       var state = target.states.create(stateId);
//       state.properties.marginBottom = -10;
//       return state;
//     }

//     if (target instanceof am4charts.Legend) {
//       var state = target.states.create(stateId);
//       state.properties.paddingTop = 0;
//       state.properties.paddingRight = 0;
//       state.properties.paddingBottom = 0;
//       state.properties.paddingLeft = 0;
//       state.properties.marginLeft = 0;
//       return state;
//     }

//     if (target instanceof am4charts.AxisRendererY) {
//       var state = target.states.create(stateId);
//       state.properties.inside = true;
//       state.properties.maxLabelPosition = 0.99;
//       return state;
//     }

//     if (
//       target instanceof am4charts.AxisLabel &&
//       target.parent instanceof am4charts.AxisRendererY
//     ) {
//       var state = target.states.create(stateId);
//       state.properties.dy = -15;
//       state.properties.paddingTop = 3;
//       state.properties.paddingRight = 5;
//       state.properties.paddingBottom = 3;
//       state.properties.paddingLeft = 5;

//       // Create a separate state for background
//       target.setStateOnChildren = true;
//       var bgstate = target.background.states.create(stateId);
//       bgstate.properties.fill = am4core.color('#fff');
//       bgstate.properties.fillOpacity = 0.7;

//       return state;
//     }

//     // if ((target instanceof am4core.Rectangle) && (target.parent instanceof am4charts.AxisLabel) && (target.parent.parent instanceof am4charts.AxisRendererY)) {
//     //   var state = target.states.create(stateId);
//     //   state.properties.fill = am4core.color("#f00");
//     //   state.properties.fillOpacity = 0.5;
//     //   return state;
//     // }

//     return null;
//   },
// });
