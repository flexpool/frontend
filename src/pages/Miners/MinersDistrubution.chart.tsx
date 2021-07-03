import React from 'react';

import { fetchApi } from 'src/utils/fetchApi';
import {
  useActiveCoin,
  useActiveCoinTicker,
  useAppTheme,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import { ChartContainer } from 'src/components/Chart/ChartContainer';
import { useAsyncState } from 'src/hooks/useAsyncState';

import { color, create, PieChart, PieSeries } from 'src/plugins/amcharts';
import { useTranslation } from 'react-i18next';

const colorListLight = [
  color('#0069ff'),
  color('#3788ff'),
  color('#62a6ff'),
  color('#8ec2ff'),
  color('#bbdcff'),
  color('#ebf5ff'),
];
const colorListDark = [
  color('#0069ff'),
  color('#005ee5'),
  color('#0054cc'),
  color('#0049b2'),
  color('#003f99'),
  color('#00347f'),
];

type Distribution = {
  hashrate: number;
  hashrateLowerThan: number;
}[];

export const MinersDistributionChart = () => {
  const coinTicker = useActiveCoinTicker();
  const dataState = useAsyncState<Distribution>('distrubutionState', []);
  const appTheme = useAppTheme();
  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('miners');
  const activeCoin = useActiveCoin();

  React.useEffect(() => {
    if (coinTicker) {
      dataState.start(
        fetchApi('/pool/minersDistribution', {
          query: { coin: coinTicker },
        })
      );
    }
    // eslint-disable-next-line
  }, [coinTicker]);

  const data = React.useMemo(() => {
    return (dataState.data || [])
      .map((item) => ({
        name: `${siFormatter(item.hashrateLowerThan / 10, {
          unit: activeCoin?.hashrateUnit,
        })} - ${siFormatter(item.hashrateLowerThan, {
          unit: activeCoin?.hashrateUnit,
        })}`,
        hashrate: item.hashrate,
      }))
      .sort(function (a, b) {
        if (a.hashrate > b.hashrate) {
          return -1;
        }
        if (a.hashrate < b.hashrate) {
          return 1;
        }
        return 0;
      });
  }, [dataState.data, siFormatter]);

  React.useLayoutEffect(() => {
    if (data.length > 0) {
      const chartDistribution = create('chartdiv', PieChart);
      chartDistribution.colors.list = [color('#b6c0d1'), color('#0069ff')];

      chartDistribution.data = data;

      var pieSeries = chartDistribution.series.push(new PieSeries());
      pieSeries.colors.list =
        appTheme === 'light' ? colorListLight : colorListDark;
      pieSeries.dataFields.value = 'hashrate';
      pieSeries.dataFields.category = 'name';
      pieSeries.slices.template.tooltipText = `{category}: {value.formatNumber("#.00 aH/s")}`;
      pieSeries.slices.template.stroke = color(
        appTheme === 'light' ? '#fff' : '#151519'
      );
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
      return () => {
        chartDistribution.dispose();
      };
    }
  }, [data, appTheme]);

  return (
    <>
      <h2>{t('distribution.title')}</h2>
      <ChartContainer dataState={dataState}>
        <div id="chartdiv" style={{ width: '100%', height: '300px' }}></div>
      </ChartContainer>
    </>
  );
};
