import React, { useState, useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { SectionNotAvailable } from 'src/components/SectionNotAvailable';
import { fetchApi } from 'src/utils/fetchApi';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';
import { useAppTheme } from 'src/rdx/localSettings/localSettings.hooks';

export const StatsChart: React.FC<{
  coinTicker: string;
  address: string;
}> = (props) => {
  const [noDataAvailable, setNoDataAvailable] = useState(false);
  const hashrateChartRef = useRef<HTMLDivElement>(null);
  const sharesChartRef = useRef<HTMLDivElement>(null);
  const reportedHashrateSeriesRef = useRef<HTMLDivElement>(null);

  const worker = useActiveSearchParamWorker();
  const appTheme = useAppTheme();
  useEffect(() => {
    let hashrateChart = am4core.create('hashrate-chart', am4charts.XYChart);

    hashrateChart.responsive.enabled = true;
    hashrateChart.responsive.useDefault = false;
    hashrateChart.responsive.rules.push(responsiveRule);

    hashrateChart.colors.list = [
      am4core.color(appTheme === 'dark' ? '#aaa' : '#000000'),
      am4core.color('#0069ff'),
      am4core.color('#15cd72'),
    ];

    let sharesChart = am4core.create('shares-chart', am4charts.XYChart);
    sharesChart.responsive.enabled = true;
    sharesChart.responsive.useDefault = false;
    sharesChart.responsive.rules.push(responsiveRule);
    sharesChart.colors.list = [
      am4core.color('#444444'),
      am4core.color('#edb431'),
      am4core.color('#0069ff'),
    ];

    var hashrateAxis = hashrateChart.yAxes.push(new am4charts.ValueAxis());
    hashrateAxis.numberFormatter = new am4core.NumberFormatter();
    hashrateAxis.renderer.grid.template.disabled = true;
    hashrateAxis.numberFormatter.numberFormat = '#.0 aH/s';
    let dateAxis = hashrateChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.baseInterval = {
      timeUnit: 'minute',
      count: 1,
    };

    let reportedHashrateSeries = hashrateChart.series.push(
      new am4charts.LineSeries()
    );
    reportedHashrateSeries.dataFields.dateX = 'date';
    reportedHashrateSeries.name = 'Reported Hashrate';
    reportedHashrateSeries.yAxis = hashrateAxis;
    reportedHashrateSeries.dataFields.valueY = 'reportedHashrate';
    reportedHashrateSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.00 aH/s")}`;
    reportedHashrateSeries.strokeWidth = 3;
    reportedHashrateSeries.smoothing = 'monotoneX';
    // reportedHashrateSeries.monotoneX = 0.9;
    // reportedHashrateSeries.monotoneY = 0.9;

    /// @ts-ignore
    reportedHashrateSeriesRef.current = reportedHashrateSeries;

    let effectiveHashrateSeries = hashrateChart.series.push(
      new am4charts.LineSeries()
    );
    effectiveHashrateSeries.dataFields.dateX = 'date';
    effectiveHashrateSeries.name = 'Effective Hashrate';
    effectiveHashrateSeries.yAxis = hashrateAxis;
    effectiveHashrateSeries.dataFields.valueY = 'effectiveHashrate';
    effectiveHashrateSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.00 aH/s")}`;
    effectiveHashrateSeries.strokeWidth = 3;
    effectiveHashrateSeries.smoothing = 'monotoneX';
    // effectiveHashrateSeries.monotoneX = 0.9;
    // effectiveHashrateSeries.monotoneY = 0.9;

    let averageEffectiveHashrateSeries = hashrateChart.series.push(
      new am4charts.LineSeries()
    );
    averageEffectiveHashrateSeries.dataFields.dateX = 'date';
    averageEffectiveHashrateSeries.name = 'Average Effective Hashrate';
    averageEffectiveHashrateSeries.yAxis = hashrateAxis;
    averageEffectiveHashrateSeries.dataFields.valueY =
      'averageEffectiveHashrate';
    averageEffectiveHashrateSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.00 aH/s")}`;
    averageEffectiveHashrateSeries.strokeWidth = 3;
    averageEffectiveHashrateSeries.smoothing = 'monotoneX';
    // averageEffectiveHashrateSeries.monotoneX = 0.9;
    // averageEffectiveHashrateSeries.monotoneY = 0.9;

    hashrateChart.cursor = new am4charts.XYCursor();
    hashrateChart.legend = new am4charts.Legend();

    var sharesAxis = sharesChart.yAxes.push(new am4charts.ValueAxis());
    sharesAxis.numberFormatter = new am4core.NumberFormatter();
    sharesAxis.renderer.grid.template.disabled = true;
    sharesAxis.numberFormatter.numberFormat = '#';
    let dateAxisShares = sharesChart.xAxes.push(new am4charts.DateAxis());
    dateAxisShares.renderer.grid.template.location = 0;
    dateAxisShares.baseInterval = {
      timeUnit: 'minute',
      count: 1,
    };

    const shares = {
      invalidShares: 'Invalid Shares',
      staleShares: 'Stale Shares',
      validShares: 'Valid Shares',
    };

    for (const share in shares) {
      let shareSeries = sharesChart.series.push(new am4charts.ColumnSeries());
      shareSeries.dataFields.dateX = 'date';

      /// @ts-ignore
      shareSeries.name = shares[share];
      shareSeries.yAxis = sharesAxis;
      shareSeries.dataFields.valueY = share;
      shareSeries.tooltipText = `{name}: {valueY.value.formatNumber("#")}`;
      shareSeries.strokeWidth = 3;
      // shareSeries.smoothing = "monotoneX";
      // shareSeries.monotoneX = 0.9;
      // shareSeries.monotoneY = 0.9;
      shareSeries.stacked = true;
    }

    sharesChart.cursor = new am4charts.XYCursor();
    sharesChart.legend = new am4charts.Legend();
    sharesChart.legend.reverseOrder = true;
    // @ts-ignore
    hashrateChartRef.current = hashrateChart;
    // @ts-ignore
    sharesChartRef.current = sharesChart;

    return () => {
      hashrateChart.dispose();
      sharesChart.dispose();
    };
  }, [appTheme]);

  useEffect(() => {
    if (props.coinTicker === null) return;
    fetchApi<
      {
        averageEffectiveHashrate: number;
        effectiveHashrate: number;
        invalidShares: number;
        reportedHashrate: number;
        staleShares: number;
        timestamp: number;
        validShares: number;
      }[]
    >('/miner/chart', {
      query: {
        address: props.address,
        coin: props.coinTicker,
        worker,
      },
    }).then((resp) => {
      if (resp === null) {
        setNoDataAvailable(true);
        /// @ts-ignore
        hashrateChartRef.current.dispose();
        /// @ts-ignore
        sharesChartRef.current.dispose();
        return;
      }
      setNoDataAvailable(false);
      var hashrateChartData = [];
      var sharesChartData = [];

      /// @ts-ignore
      reportedHashrateSeriesRef.current.show();

      var reportedHashrateEnabled = false;

      for (var i = 0; i < resp.length; i++) {
        const item = resp[i];
        if (item.reportedHashrate > 0) reportedHashrateEnabled = true;
        hashrateChartData.push({
          date: new Date(item.timestamp * 1000),
          effectiveHashrate: item.effectiveHashrate,
          averageEffectiveHashrate: item.averageEffectiveHashrate,
          reportedHashrate: item.reportedHashrate,
        });

        sharesChartData.push({
          date: new Date(item.timestamp * 1000),
          validShares: item.validShares,
          staleShares: item.staleShares,
          invalidShares: item.invalidShares,
        });
      }

      if (!reportedHashrateEnabled) {
        /// @ts-ignore
        reportedHashrateSeriesRef.current.hide();
      }

      /// @ts-ignore
      sharesChartRef.current.data = sharesChartData.reverse();
      /// @ts-ignore
      hashrateChartRef.current.data = hashrateChartData.reverse();
    });
  }, [props.coinTicker, props.address, worker]);

  return (
    <>
      {!noDataAvailable ? (
        <>
          <ChartContainer title="Hashrate">
            <div
              id="hashrate-chart"
              style={{ width: '100%', height: '250px' }}
            />
          </ChartContainer>
          <Spacer />
          <ChartContainer title="Shares">
            <div id="shares-chart" style={{ width: '100%', height: '250px' }} />
          </ChartContainer>
        </>
      ) : (
        <SectionNotAvailable
          imageURL={
            'https://static.flexpool.io/assets/website-illustrations/stats.svg'
          }
          title={'Not enough data'}
          description={"It looks like you haven't submitted any valid share"}
        />
      )}
    </>
  );
};

export default StatsChart;
