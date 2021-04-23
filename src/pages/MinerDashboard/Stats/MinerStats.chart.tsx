import React, { useState, useEffect } from 'react';
import { SectionNotAvailable } from 'src/components/SectionNotAvailable';
import { fetchApi } from 'src/utils/fetchApi';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';
import { useAppTheme } from 'src/rdx/localSettings/localSettings.hooks';

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
} from 'src/plugins/amcharts';
import { isAfter, subHours } from 'date-fns';
import { average } from 'src/utils/number.utils';
import { AverageEffectivePeriods } from './minerStats.types';

export const StatsChart: React.FC<{
  coinTicker: string;
  address: string;
  setAverageEffectivePeriods: (data: AverageEffectivePeriods) => void;
}> = (props) => {
  const { setAverageEffectivePeriods } = props;
  const [noDataAvailable, setNoDataAvailable] = useState(false);

  const [sharesData, setSharesData] = React.useState<
    | {
        date: Date;
        validShares: number;
        staleShares: number;
        invalidShares: number;
      }[]
    | null
  >();
  const [hashrateData, setHashrateData] = React.useState<
    | {
        date: Date;
        effectiveHashrate: number;
        averageEffectiveHashrate: number;
        reportedHashrate: number;
      }[]
    | null
  >();

  const worker = useActiveSearchParamWorker();
  const appTheme = useAppTheme();
  useEffect(() => {
    if (sharesData && hashrateData) {
      let hashrateChart = create('hashrate-chart', XYChart);

      hashrateChart.responsive.enabled = true;
      hashrateChart.responsive.useDefault = false;
      hashrateChart.responsive.rules.push(responsiveRule);

      hashrateChart.colors.list = [
        color(appTheme === 'dark' ? '#aaa' : '#000000'),
        color('#0069ff'),
        color('#15cd72'),
      ];

      let sharesChart = create('shares-chart', XYChart);
      sharesChart.responsive.enabled = true;
      sharesChart.responsive.useDefault = false;
      sharesChart.responsive.rules.push(responsiveRule);
      sharesChart.colors.list = [
        color('#444444'),
        color('#edb431'),
        color('#0069ff'),
      ];

      var hashrateAxis = hashrateChart.yAxes.push(new ValueAxis());
      hashrateAxis.numberFormatter = new NumberFormatter();
      hashrateAxis.renderer.grid.template.disabled = true;
      hashrateAxis.numberFormatter.numberFormat = '#.0 aH/s';
      let dateAxis = hashrateChart.xAxes.push(new DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.baseInterval = {
        timeUnit: 'minute',
        count: 1,
      };

      let reportedHashrateSeries = hashrateChart.series.push(new LineSeries());
      reportedHashrateSeries.dataFields.dateX = 'date';
      reportedHashrateSeries.name = 'Reported Hashrate';
      reportedHashrateSeries.yAxis = hashrateAxis;
      reportedHashrateSeries.dataFields.valueY = 'reportedHashrate';
      reportedHashrateSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.00 aH/s")}`;
      reportedHashrateSeries.strokeWidth = 3;
      reportedHashrateSeries.smoothing = 'monotoneX';
      // reportedHashrateSeries.monotoneX = 0.9;
      // reportedHashrateSeries.monotoneY = 0.9;

      let effectiveHashrateSeries = hashrateChart.series.push(new LineSeries());
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
        new LineSeries()
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

      hashrateChart.cursor = new XYCursor();
      hashrateChart.legend = new Legend();

      var sharesAxis = sharesChart.yAxes.push(new ValueAxis());
      sharesAxis.numberFormatter = new NumberFormatter();
      sharesAxis.renderer.grid.template.disabled = true;
      sharesAxis.numberFormatter.numberFormat = '#';
      let dateAxisShares = sharesChart.xAxes.push(new DateAxis());
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
        let shareSeries = sharesChart.series.push(new ColumnSeries());
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

      sharesChart.cursor = new XYCursor();
      sharesChart.legend = new Legend();
      sharesChart.legend.reverseOrder = true;

      sharesChart.data = sharesData.reverse();
      hashrateChart.data = hashrateData.reverse();

      return () => {
        hashrateChart.dispose();
        sharesChart.dispose();
      };
    }
  }, [appTheme, sharesData, hashrateData]);

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
        setSharesData(null);
        setHashrateData(null);
        return;
      }
      setNoDataAvailable(false);
      const hashrateChartData = [];
      const sharesChartData = [];
      const averageSixHours = [];
      const averageTwelveHours = [];

      const nowMinus12 = subHours(new Date(), 12);
      const nowMinus6 = subHours(new Date(), 6);

      for (let i = 0; i < resp.length; i++) {
        const item = resp[i];

        const itemTimestamp = new Date(item.timestamp * 1000);

        hashrateChartData.push({
          date: itemTimestamp,
          effectiveHashrate: item.effectiveHashrate,
          averageEffectiveHashrate: item.averageEffectiveHashrate,
          reportedHashrate: item.reportedHashrate,
        });

        sharesChartData.push({
          date: itemTimestamp,
          validShares: item.validShares,
          staleShares: item.staleShares,
          invalidShares: item.invalidShares,
        });

        if (isAfter(itemTimestamp, nowMinus12)) {
          averageTwelveHours.push(item.effectiveHashrate);
          if (isAfter(itemTimestamp, nowMinus6)) {
            averageSixHours.push(item.effectiveHashrate);
          }
        }
      }

      console.log(average(averageSixHours));
      console.log(average(averageTwelveHours));

      setAverageEffectivePeriods({
        '6': average(averageSixHours),
        '12': average(averageTwelveHours),
      });

      setSharesData(sharesChartData);
      setHashrateData(hashrateChartData);
    });
  }, [props.coinTicker, props.address, worker, setAverageEffectivePeriods]);

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
          description={
            "We don't have enough data to show charts. If your workers are already mining, please allow up to 10 minutes for the data to be processed."
          }
        />
      )}
    </>
  );
};

export default StatsChart;
