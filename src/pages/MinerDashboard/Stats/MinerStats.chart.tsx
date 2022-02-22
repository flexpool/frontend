import React, { useEffect, useMemo } from 'react';
import { SectionNotAvailable } from '@/components/SectionNotAvailable';
import { Spacer } from '@/components/layout/Spacer';
import { useActiveSearchParamWorker } from '@/hooks/useActiveQueryWorker';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useThemeMode } from '@/context/ThemeModeProvider';
import useMinerStatsChartQuery from '@/hooks/api/useMinerStatsChartQuery';
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
} from '@/plugins/amcharts';
import { useTranslation } from 'next-i18next';
import { ProTip } from '@/components/ProTip/ProTip';

export const StatsChart: React.FC<{
  coinTicker: string;
  address: string;
}> = (props) => {
  const { t } = useTranslation('dashboard');
  const activeCoin = useActiveCoin();
  const worker = useActiveSearchParamWorker();

  const { color: themeColor } = useThemeMode();

  const minerStatsChartQuery = useMinerStatsChartQuery({
    coin: props.coinTicker,
    address: props.address,
    worker,
  });

  const hashrateData = useMemo(() => {
    if (minerStatsChartQuery.data) {
      return minerStatsChartQuery.data.map((item) => ({
        date: new Date(item.timestamp * 1000),
        effectiveHashrate: item.effectiveHashrate,
        averageEffectiveHashrate: item.averageEffectiveHashrate,
        reportedHashrate: item.reportedHashrate,
      }));
    }
    return null;
  }, [minerStatsChartQuery.data]);

  const sharesData = useMemo(() => {
    if (minerStatsChartQuery.data) {
      return minerStatsChartQuery.data.map((item) => ({
        date: new Date(item.timestamp * 1000),
        validShares: item.validShares,
        staleShares: item.staleShares,
        invalidShares: item.invalidShares,
      }));
    }
    return null;
  }, [minerStatsChartQuery.data]);

  useEffect(() => {
    if (sharesData && hashrateData) {
      let hashrateChart = create('hashrate-chart', XYChart);

      hashrateChart.responsive.enabled = true;
      hashrateChart.responsive.useDefault = false;
      hashrateChart.responsive.rules.push(responsiveRule);

      hashrateChart.colors.list = [
        color(themeColor === 'dark' ? '#aaa' : '#000000'),
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
  }, [themeColor, sharesData, hashrateData, t, activeCoin]);

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
      {minerStatsChartQuery.data !== null ? (
        <>
          <ChartContainer
            dataState={minerStatsChartQuery}
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
            dataState={minerStatsChartQuery}
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
