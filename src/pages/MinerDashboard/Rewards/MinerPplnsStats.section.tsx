import React from 'react';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { Spacer } from 'src/components/layout/Spacer';
import { StatItem } from 'src/components/StatItem';
import { TooltipContent, Tooltip } from 'src/components/Tooltip';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import {
  useLocalizedNumberFormatter,
  useLocalizedSiFormatter,
} from 'src/utils/si.utils';

import {
  color,
  NumberFormatter,
  create,
  Legend,
  XYChart,
  XYCursor,
  CategoryAxis,
  ValueAxis,
  ColumnSeries,
} from 'src/plugins/amcharts';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import useMinerRoundShareQuery from '@/hooks/api/useMinerRoundShareQuery';
import usePoolAverageBlockRewardQuery from '@/hooks/api/usePoolAverageBlockRewardQuery';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useTranslation } from 'next-i18next';
import { PPLNSChartDataItem } from './MinerRewards.types';
import { useMinerShareLogQuery } from '@/hooks/api/useMinerShareLogQuery';

const mapPplnsDataToChartData = (
  data: number[],
  siFormatter: ReturnType<typeof useLocalizedSiFormatter>
) => {
  const SIZE = 10000;
  const res: { [k: string]: number } = {};
  let totalShares = 0;

  for (let k = 0; k < data.length; k += 1) {
    totalShares += data[k];
    const index = Math.floor(totalShares / SIZE);
    if (k !== data.length - 1) {
      totalShares += 1;
      const total = res[index] || 0;
      res[index] = total + 1;
    }
  }

  const mapped: PPLNSChartDataItem[] = [];
  for (let x = 0; x < totalShares / SIZE; x += 1) {
    mapped.push({
      number: siFormatter(x * SIZE),
      roundShare: ((res[x] || 0) / SIZE) * 100,
      your: res[x],
    });
  }

  return {
    totalShares,
    data: mapped,
  };
};

export const MinerPplnsStats: React.FC<{
  coin: string;
  averagePoolHashrate: number | null | undefined;
  poolHashrate: number | null | undefined;
  address: string;
}> = ({ coin, averagePoolHashrate = 0, poolHashrate = 0, address }) => {
  const { data: roundShare } = useMinerRoundShareQuery({ coin, address });
  const { data: averageBlockReward } = usePoolAverageBlockRewardQuery({ coin });

  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('dashboard');

  const [shareLogLength, setShareLogLength] = React.useState(0);
  const activeCoin = useActiveCoin();
  const numberFormatter = useLocalizedNumberFormatter();

  const shareLogState = useMinerShareLogQuery({
    address,
    coin,
  });

  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();

  const averageBlockShare = React.useMemo(() => {
    if (averageBlockReward && roundShare) {
      return activeCoinFormatter(averageBlockReward * roundShare, {
        maximumFractionDigits: 8,
      });
    }
    return null;
  }, [activeCoinFormatter, roundShare, averageBlockReward]);

  const dateFormatter = useLocalizedDateFormatter();

  React.useEffect(() => {
    const data = shareLogState.data || [];

    if (data && data.length > 0) {
      const mappedData = mapPplnsDataToChartData(data, siFormatter);
      setShareLogLength(mappedData.totalShares);

      let sharesChart = create('shares2-chart', XYChart);

      sharesChart.responsive.enabled = true;
      sharesChart.responsive.useDefault = false;
      sharesChart.responsive.rules.push(responsiveRule);
      sharesChart.colors.list = [
        color('#0069ff'),
        color('#edb431'),
        color('#444444'),
      ];

      var sharesAxis = sharesChart.yAxes.push(new ValueAxis());

      sharesAxis.numberFormatter = new NumberFormatter();
      sharesAxis.renderer.grid.template.disabled = true;

      let categoryAxis = sharesChart.xAxes.push(new CategoryAxis());
      categoryAxis.dataFields.category = 'number';

      let yourSharesSeries = sharesChart.series.push(new ColumnSeries());

      yourSharesSeries.dataFields.categoryX = 'number';
      yourSharesSeries.name = t('rewards.pplns_chart.valid_shares');
      yourSharesSeries.yAxis = sharesAxis;
      yourSharesSeries.dataFields.valueY = 'your';
      yourSharesSeries.tooltipText = `{valueY} ${t(
        'rewards.pplns_chart.valid_shares'
      )} ({roundShare}%)`;

      sharesChart.cursor = new XYCursor();
      sharesChart.legend = new Legend();

      sharesChart.data = mappedData.data;
      return () => {
        sharesChart.dispose();
      };
    }
  }, [shareLogState.data, t, siFormatter]);

  return (
    <>
      <h2>{t('rewards.pplns.title')}</h2>
      <CardGrid>
        <Card padding>
          <CardTitle>
            {t('rewards.pplns.avp.title')}{' '}
            <Tooltip>
              <TooltipContent message={t('rewards.pplns.avp.tooltip')} />
            </Tooltip>
          </CardTitle>
          <StatItem
            value={
              averagePoolHashrate &&
              roundShare &&
              siFormatter(averagePoolHashrate * roundShare, {
                unit: activeCoin?.hashrateUnit,
              })
            }
            subValue={
              poolHashrate &&
              roundShare &&
              `${t('rewards.pplns.avp.current')}: ${siFormatter(
                poolHashrate * roundShare,
                { unit: activeCoin?.hashrateUnit }
              )}`
            }
          />
        </Card>
        <Card padding>
          <CardTitle>
            {t('rewards.pplns.crs.title')}&nbsp;
            <Tooltip>
              <TooltipContent message={t('rewards.pplns.crs.tooltip')} />
            </Tooltip>
          </CardTitle>
          <StatItem
            value={
              roundShare &&
              numberFormatter(roundShare, {
                style: 'percent',
                maximumFractionDigits: 8,
              })
            }
            subValue={
              averageBlockShare && (
                <>
                  {t('rewards.pplns.crs.aprox')}: {averageBlockShare}
                </>
              )
            }
          />
        </Card>
        <Card padding>
          <CardTitle>
            {t('rewards.pplns.log.title')}&nbsp;
            <Tooltip>
              <TooltipContent
                message={'Time for the round share to drop to zero'}
              />
            </Tooltip>
          </CardTitle>
          <StatItem
            value={
              averagePoolHashrate &&
              shareLogLength &&
              activeCoin &&
              `${dateFormatter.durationWords(
                (shareLogLength * activeCoin.shareDifficulty) /
                  (averagePoolHashrate / activeCoin.difficultyFactor),
                { includeSeconds: false }
              )}`
            }
            subValue={
              averagePoolHashrate &&
              shareLogLength &&
              `${t('rewards.pplns.log.size', {
                value: siFormatter(shareLogLength),
              })} • ${siFormatter(averagePoolHashrate, {
                unit: activeCoin?.hashrateUnit,
              })}`
            }
          />
        </Card>
      </CardGrid>
      <Spacer />
      <ChartContainer
        title={t('rewards.pplns_chart.title')}
        dataState={shareLogState}
      >
        <div
          id="shares2-chart"
          style={{ width: '100%', height: '250px' }}
        ></div>
      </ChartContainer>
    </>
  );
};
