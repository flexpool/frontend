import React, { useState, useEffect } from 'react';
import { SectionNotAvailable } from 'src/components/SectionNotAvailable';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';
import {
  useActiveCoin,
  useAppTheme,
} from 'src/rdx/localSettings/localSettings.hooks';

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
import {
  AverageEffectivePeriods,
  HashrateChartDataItem,
  SharesChartDataItem,
} from './minerStats.types';
import { useTranslation } from 'next-i18next';
import { useReduxState } from 'src/rdx/useReduxState';
import { ProTip } from 'src/components/ProTip/ProTip';

export const StatsChart: React.FC<{
  coinTicker: string;
  address: string;
  setAverageEffectivePeriods: (data: AverageEffectivePeriods) => void;
}> = (props) => {
  const { setAverageEffectivePeriods } = props;
  const [noDataAvailable, setNoDataAvailable] = useState(false);
  const { t } = useTranslation('dashboard');
  const minerStatChartDataPointsState = useReduxState('minerStatsChart');
  const data = minerStatChartDataPointsState.data;

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

  const activeCoin = useActiveCoin();

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
      hashrateAxis.numberFormatter.numberFormat =
        "#.0 a'" + activeCoin?.hashrateUnit + "'";
      let dateAxis = hashrateChart.xAxes.push(new DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.baseInterval = {
        timeUnit: 'minute',
        count: 1,
      };

      var reportedHashrateExists = false;

      hashrateData.forEach((item) => {
        if (item.reportedHashrate > 0) reportedHashrateExists = true;
      });

      if (!reportedHashrateExists) {
        hashrateChart.colors.list.splice(0, 1);
      }

      if (reportedHashrateExists) {
        let reportedHashrateSeries = hashrateChart.series.push(
          new LineSeries()
        );
        reportedHashrateSeries.dataFields.dateX = 'date';
        reportedHashrateSeries.name =
          activeCoin?.hashrateUnit === 'B'
            ? t('stats.hashrate_chart.reported_space')
            : t('stats.hashrate_chart.reported');
        reportedHashrateSeries.yAxis = hashrateAxis;
        reportedHashrateSeries.dataFields.valueY = 'reportedHashrate';
        reportedHashrateSeries.tooltipText =
          `{name}: {valueY.value.formatNumber("#.00 a'` +
          activeCoin?.hashrateUnit +
          `'")}`;
        reportedHashrateSeries.strokeWidth = 3;
        reportedHashrateSeries.smoothing = 'monotoneX';
        // reportedHashrateSeries.monotoneX = 0.9;
        // reportedHashrateSeries.monotoneY = 0.9;
      }

      let effectiveHashrateSeries = hashrateChart.series.push(new LineSeries());
      effectiveHashrateSeries.dataFields.dateX = 'date';
      effectiveHashrateSeries.name =
        activeCoin?.hashrateUnit === 'B'
          ? t('stats.hashrate_chart.effective_space')
          : t('stats.hashrate_chart.effective');
      effectiveHashrateSeries.yAxis = hashrateAxis;
      effectiveHashrateSeries.dataFields.valueY = 'effectiveHashrate';
      effectiveHashrateSeries.tooltipText =
        `{name}: {valueY.value.formatNumber("#.00 a'` +
        activeCoin?.hashrateUnit +
        `'")}`;
      effectiveHashrateSeries.strokeWidth = 3;
      effectiveHashrateSeries.smoothing = 'monotoneX';
      // effectiveHashrateSeries.monotoneX = 0.9;
      // effectiveHashrateSeries.monotoneY = 0.9;

      let averageEffectiveHashrateSeries = hashrateChart.series.push(
        new LineSeries()
      );
      averageEffectiveHashrateSeries.dataFields.dateX = 'date';
      averageEffectiveHashrateSeries.name =
        activeCoin?.hashrateUnit === 'B'
          ? t('stats.hashrate_chart.average_space')
          : t('stats.hashrate_chart.average');
      averageEffectiveHashrateSeries.yAxis = hashrateAxis;
      averageEffectiveHashrateSeries.dataFields.valueY =
        'averageEffectiveHashrate';
      averageEffectiveHashrateSeries.tooltipText =
        `{name}: {valueY.value.formatNumber("#.00 a'` +
        activeCoin?.hashrateUnit +
        `'")}`;
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
        invalidShares: t('stats.shares_chart.invalid'),
        staleShares: t('stats.shares_chart.stale'),
        validShares: t('stats.shares_chart.valid'),
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
  }, [appTheme, sharesData, hashrateData, t, activeCoin]);

  useEffect(() => {
    if (props.coinTicker === null) return;
    if (data === null || data === undefined) {
      setNoDataAvailable(true);
      setSharesData(null);
      setHashrateData(null);
      return;
    }
    setNoDataAvailable(false);

    const hashrateChartData: HashrateChartDataItem[] = [];
    const sharesChartData: SharesChartDataItem[] = [];

    const averageSixHours: number[] = [];
    const averageTwelveHours: number[] = [];

    const nowMinus12 = subHours(new Date(), 12);
    const nowMinus6 = subHours(new Date(), 6);
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

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

    setAverageEffectivePeriods({
      '6': average(averageSixHours),
      '12': average(averageTwelveHours),
    });

    setSharesData(sharesChartData);
    setHashrateData(hashrateChartData);
  }, [
    props.coinTicker,
    props.address,
    worker,
    setAverageEffectivePeriods,
    data,
  ]);
  const proTips = [
    'stats.proTips.chartsProTip',
    'stats.proTips.apiProTip',
    'stats.proTips.hoverHashrateProtip',
    'stats.proTips.tablesProTip',
    'stats.proTips.payoutExportProTip',
    'stats.proTips.rewardsExportProTip',
    'stats.proTips.searchProTip',
  ];
  return (
    <>
      {!noDataAvailable ? (
        <>
          <ChartContainer
            title={
              activeCoin?.hashrateUnit === 'B'
                ? t('stats.hashrate_chart.title_space')
                : t('stats.hashrate_chart.title')
            }
          >
            <div
              id="hashrate-chart"
              style={{ width: '100%', height: '250px' }}
            />
          </ChartContainer>
          <Spacer />
          <ChartContainer
            title={t(
              String(activeCoin?.ticker) === 'xch'
                ? 'stats.shares_chart.title_points'
                : 'stats.shares_chart.title'
            )}
          >
            <div id="shares-chart" style={{ width: '100%', height: '250px' }} />
          </ChartContainer>
          <ProTip>
            <span>
              {t(proTips[Math.floor(Math.random() * proTips.length)])}
            </span>
          </ProTip>
        </>
      ) : (
        <SectionNotAvailable
          imageURL={
            'https://static.flexpool.io/assets/website-illustrations/stats.svg'
          }
          title={t('stats.not_enough_data')}
          description={t('stats.not_enough_data_message')}
        />
      )}
    </>
  );
};

export default StatsChart;
