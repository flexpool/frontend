import React, { useRef, useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { fetchApi } from 'src/utils/fetchApi';
import { formatRegionName } from 'src/utils/region.utils';
import { ApiRegion } from 'src/types/Region.types';
import { Card } from 'src/components/layout/Card';
import { useDispatch } from 'react-redux';
import { poolHashrateGet } from 'src/rdx/poolHashrate/poolHashrate.actions';
import { useReduxState } from 'src/rdx/useReduxState';

type HashrateItem = {
  minerCount: number;
  regions: {
    [key in ApiRegion]: number;
  };
  timestamp: number;
  total: number;
};

const PoolHashrateChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const activeCoin = useActiveCoin();
  const poolHasrateState = useReduxState('poolHashrate');

  const d = useDispatch();
  React.useEffect(() => {
    d(poolHashrateGet(activeCoin));
  }, [activeCoin, d]);

  React.useLayoutEffect(() => {
    let x = am4core.create('chartdiv', am4charts.XYChart);
    x.colors.list = [
      am4core.color('#000000'),
      am4core.color('#edb431'),
      am4core.color('#5d42f5'),
      am4core.color('#15cd72'),
      am4core.color('#ed4f32'),
      am4core.color('#0069ff'),
    ];
    if (poolHasrateState.data.length > 1) {
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
    }
    return () => {
      x.dispose();
    };
  }, [poolHasrateState.data]);

  return (
    <Card padding>
      <div id="chartdiv" style={{ width: '100%', height: '400px' }}></div>
    </Card>
  );
};
export default PoolHashrateChart;
