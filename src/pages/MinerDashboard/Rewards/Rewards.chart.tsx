import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ApiMinerReward } from 'src/types/Miner.types';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import {
  useActiveCoin,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { Card } from 'src/components/layout/Card';
import { ChartTitle } from 'src/components/Typo/ChartTitle';
import { ChartDataNotAvailable } from 'src/components/Chart/NotAvailable';

const RewardsChart: React.FC<{
  rewards: ApiMinerReward[];
  counterPrice: number;
}> = (props) => {
  const { rewards, counterPrice } = props;
  const coin = useActiveCoin();
  const counterTicker = useCounterTicker();
  React.useEffect(() => {
    if (!rewards || !counterPrice || !coin) return;

    let rewardsChart = am4core.create('rewards-chart', am4charts.XYChart);
    rewardsChart.colors.list = [am4core.color('#0069ff')];
    const rewardsChartData = rewards.map((item) => ({
      date: new Date(item.timestamp * 1000),
      totalRewards: item.totalRewards / Math.pow(10, coin.decimalPlaces),
      countervaluedRewards: getDisplayCounterTickerValue(
        (item.totalRewards / Math.pow(10, coin.decimalPlaces)) * counterPrice,
        counterTicker
      ),
    }));

    rewardsChart.data = rewardsChartData.reverse();

    var rewardsAxis = rewardsChart.yAxes.push(new am4charts.ValueAxis());
    rewardsAxis.numberFormatter = new am4core.NumberFormatter();
    rewardsAxis.renderer.grid.template.disabled = true;
    let dateAxis = rewardsChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };

    let rewardSeries = rewardsChart.series.push(new am4charts.ColumnSeries());

    rewardSeries.dataFields.dateX = 'date';
    rewardSeries.name = 'Earnings (' + coin.ticker.toUpperCase() + ')';
    rewardSeries.yAxis = rewardsAxis;
    rewardSeries.dataFields.valueY = 'totalRewards';

    rewardSeries.tooltipText = `Daily Income: {valueY.value.formatNumber("#.0000000")} ETH ({countervaluedRewards})`;

    rewardsChart.cursor = new am4charts.XYCursor();
    rewardsChart.legend = new am4charts.Legend();

    return () => {
      rewardsChart.dispose();
    };
    // eslint-disable-next-line
  }, [coin, rewards, counterPrice]);

  return (
    <>
      <Card padding>
        <ChartTitle>Earnings This Month</ChartTitle>
        <div id="rewards-chart" style={{ width: '100%', height: '250px' }}>
          {rewards.length < 1 && <ChartDataNotAvailable />}
        </div>
      </Card>
    </>
  );
};

export default RewardsChart;
