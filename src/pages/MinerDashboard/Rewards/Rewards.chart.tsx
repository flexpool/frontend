import React from 'react';
import { ApiMinerReward } from 'src/types/Miner.types';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import {
  useActiveCoin,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
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
} from 'src/plugins/amcharts';

const RewardsChart: React.FC<{
  rewards: ApiMinerReward[];
  counterPrice: number;
  error?: any;
  isLoading: boolean;
}> = (props) => {
  const { rewards, counterPrice } = props;
  const coin = useActiveCoin();
  const counterTicker = useCounterTicker();

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (!rewards || !counterPrice || !coin) return;

    let rewardsChart = create('rewards-chart', XYChart);

    rewardsChart.responsive.enabled = true;
    rewardsChart.responsive.useDefault = false;
    rewardsChart.responsive.rules.push(responsiveRule);
    rewardsChart.colors.list = [color('#0069ff')];
    const rewardsChartData = rewards.map((item) => ({
      date: new Date(item.timestamp * 1000),
      totalRewards: item.totalRewards / Math.pow(10, coin.decimalPlaces),
      countervaluedRewards: getDisplayCounterTickerValue(
        (item.totalRewards / Math.pow(10, coin.decimalPlaces)) * counterPrice,
        counterTicker
      ),
    }));

    rewardsChart.data = rewardsChartData.reverse();

    var rewardsAxis = rewardsChart.yAxes.push(new ValueAxis());
    rewardsAxis.numberFormatter = new NumberFormatter();
    rewardsAxis.renderer.grid.template.disabled = true;
    rewardsAxis.min = 0;
    let dateAxis = rewardsChart.xAxes.push(new DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };

    let rewardSeries = rewardsChart.series.push(new ColumnSeries());

    rewardSeries.dataFields.dateX = 'date';
    rewardSeries.name = 'Earnings (' + coin.ticker.toUpperCase() + ')';
    rewardSeries.yAxis = rewardsAxis;
    rewardSeries.dataFields.valueY = 'totalRewards';

    rewardSeries.tooltipText = `Daily Income: {valueY.value.formatNumber("#.0000000")} ETH ({countervaluedRewards})`;

    rewardsChart.cursor = new XYCursor();
    rewardsChart.legend = new Legend();

    return () => {
      rewardsChart.dispose();
    };
    // eslint-disable-next-line
  }, [coin, rewards, counterPrice]);

  return (
    <>
      <ChartContainer
        title="Earnings This Month"
        dataState={{
          error: props.error,
          isLoading: props.isLoading,
          data: rewards,
        }}
      >
        <div id="rewards-chart" style={{ width: '100%', height: '250px' }} />
      </ChartContainer>
    </>
  );
};

export default RewardsChart;
