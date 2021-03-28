import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { fetchApi } from 'src/utils/fetchApi';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { formatSi } from 'src/utils/si.utils';
import { Card } from 'src/components/layout/Card';

export const MinersDistributionChart = () => {
  const coinTicker = useActiveCoinTicker();

  React.useLayoutEffect(() => {
    const chartDistribution = am4core.create('chartdiv', am4charts.PieChart);
    chartDistribution.colors.list = [
      am4core.color('#b6c0d1'),
      am4core.color('#0069ff'),
    ];

    if (coinTicker === undefined) return;

    fetchApi<
      {
        hashrate: number;
        hashrateLowerThan: number;
      }[]
    >('/pool/minersDistribution', {
      query: { coin: coinTicker },
    }).then((resp) => {
      const data = resp
        .map((item) => ({
          name: `${formatSi(item.hashrateLowerThan / 10, 'H/s')} - ${formatSi(
            item.hashrateLowerThan,
            'H/s'
          )}`,
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

      chartDistribution.data = data;

      var pieSeries = chartDistribution.series.push(new am4charts.PieSeries());
      pieSeries.colors.list = [
        am4core.color('#0069ff'),
        am4core.color('#3788ff'),
        am4core.color('#62a6ff'),
        am4core.color('#8ec2ff'),
        am4core.color('#bbdcff'),
        am4core.color('#ebf5ff'),
      ];
      pieSeries.dataFields.value = 'hashrate';
      pieSeries.dataFields.category = 'name';
      pieSeries.slices.template.tooltipText = `{category}: {value.formatNumber("#.00 aH/s")}`;
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
    });
    return () => {
      chartDistribution.dispose();
    };
  }, [coinTicker]);

  return (
    <>
      <h2>Miners Distribution by Hashrate </h2>
      <Card padding>
        {/* <ChartTitle>Miners Distribution by Hashrate </ChartTitle> */}
        <div id="chartdiv" style={{ width: '100%', height: '300px' }}></div>
      </Card>
    </>
  );
};
