import React from 'react';
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

import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { fetchApi } from 'src/utils/fetchApi';
import { useAsyncState } from 'src/hooks/useAsyncState';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';
import { useTranslation } from 'react-i18next';

type ChartData = {
  fee: number;
  timestamp: number;
  value: number;
}[];

const PaymentsChart: React.FC<{ address: string; coin?: ApiPoolCoin }> = ({
  coin,
  address,
}) => {
  const { t } = useTranslation('dashboard');
  const asyncState = useAsyncState<
    {
      fee: number;
      date: Date;
      value: number;
    }[]
  >();

  React.useEffect(() => {
    if (coin && asyncState.data && asyncState.data.length > 0) {
      const paymentsChart = create('payments-chart', XYChart);

      paymentsChart.responsive.enabled = true;
      paymentsChart.responsive.useDefault = false;
      paymentsChart.responsive.rules.push(responsiveRule);
      paymentsChart.colors.list = [color('#0069ff')];

      var paymentsAxis = paymentsChart.yAxes.push(new ValueAxis());
      paymentsAxis.numberFormatter = new NumberFormatter();
      paymentsAxis.renderer.grid.template.disabled = true;
      let dateAxis = paymentsChart.xAxes.push(new DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.baseInterval = {
        timeUnit: 'day',
        count: 1,
      };
      let paymentSeries = paymentsChart.series.push(new ColumnSeries());

      paymentSeries.dataFields.dateX = 'date';
      paymentSeries.name = `${t(
        'payments.chart.value'
      )} (${coin.ticker.toUpperCase()})`;
      paymentSeries.yAxis = paymentsAxis;
      paymentSeries.dataFields.valueY = 'value';
      paymentSeries.tooltipText = `{name}: {valueY.value.formatNumber("#.0000")}`;
      paymentSeries.strokeWidth = 3;
      paymentSeries.stacked = true;

      paymentsChart.cursor = new XYCursor();
      paymentsChart.legend = new Legend();
      paymentsChart.data = asyncState.data.reverse();
      return () => {
        paymentsChart.dispose();
      };
    }
  }, [coin, asyncState.data, t]);

  React.useEffect(() => {
    if (coin?.decimalPlaces && coin?.ticker) {
      asyncState.start(
        fetchApi<ChartData>('/miner/paymentsChart', {
          query: {
            address: address,
            coin: coin.ticker,
          },
        }).then((resp) => {
          return (resp || []).map((item) => ({
            date: new Date(item.timestamp * 1000),
            value:
              item.value / Math.pow(10, coin.decimalPlaces) -
              item.fee / Math.pow(10, coin.decimalPlaces),
            fee: item.fee / Math.pow(10, coin.decimalPlaces),
          }));
        })
      );
    }
    // eslint-disable-next-line
  }, [coin?.ticker, coin?.decimalPlaces, address]);

  return (
    <>
      <ChartContainer title={t('payments.chart.title')} dataState={asyncState}>
        <div id="payments-chart" style={{ width: '100%', height: '250px' }} />
      </ChartContainer>
    </>
  );
};

export default PaymentsChart;
