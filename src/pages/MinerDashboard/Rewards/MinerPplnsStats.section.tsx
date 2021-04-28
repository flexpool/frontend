import React from 'react';
import { useRouteMatch } from 'react-router';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { Spacer } from 'src/components/layout/Spacer';
import { StatItem } from 'src/components/StatItem';
import { TooltipContent, Tooltip } from 'src/components/Tooltip';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { fetchApi } from 'src/utils/fetchApi';
import {
  useLocalizedNumberValueFormatter,
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
import { dateUtils } from 'src/utils/date.utils';
import { useAsyncState } from 'src/hooks/useAsyncState';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useTranslation } from 'react-i18next';

export const MinerPplnsStats: React.FC<{
  averagePoolHashrate: number | null | undefined;
  poolHashrate: number | null | undefined;
}> = ({ averagePoolHashrate = 0, poolHashrate = 0 }) => {
  const { data: headerStatsData } = useReduxState('minerHeaderStats');
  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('dashboard');

  const [shareLogLength, setShareLogLength] = React.useState(0);
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();
  const activeCoinTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  const numberFormatter = useLocalizedNumberValueFormatter();

  const shareLogState = useAsyncState<number[]>();
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const approximateBlockShare = activeCoinFormatter(
    headerStatsData?.approximateBlockShare,
    { maximumFractionDigits: 8 }
  );

  React.useEffect(() => {
    if (address && activeCoinTicker) {
      shareLogState.start(
        fetchApi<number[]>('/miner/shareLog', {
          query: {
            address: address,
            coin: activeCoinTicker,
          },
        })
      );
    }
    // eslint-disable-next-line
  }, [address, activeCoinTicker]);

  React.useEffect(() => {
    const data = shareLogState.data || [];

    if (data && data.length > 0) {
      var sharesDataTmp: {
        [key: string]: {
          number: string;
          other: number;
          your: number;
        };
      } = {};

      let totalShares = 0;
      let totalYour = 0;
      for (var i = 0; i < data.length; i++) {
        const item = data[i];
        if (item === 0) {
          continue;
        }
        for (var j = 0; j < item; j++) {
          if (!sharesDataTmp[`${Math.floor(totalShares / 10000)}`]) {
            sharesDataTmp[`${Math.floor(totalShares / 10000)}`] = {
              number: `${totalShares / 1000}k`,
              other: 0,
              your: 0,
            };
          }

          sharesDataTmp[`${Math.floor(totalShares / 10000)}`].other++;
          totalShares++;
        }

        if (!sharesDataTmp[`${Math.floor(totalShares / 10000)}`]) {
          continue;
        }

        sharesDataTmp[`${Math.floor(totalShares / 10000)}`].your++;
        // eslint-disable-next-line
        totalYour++;
        totalShares++;
      }
      setShareLogLength(totalShares);

      let sharesChart = create('shares-chart', XYChart);

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

      const sharesDataTmpUnwrapped = Object.values(sharesDataTmp).map(
        (item) => ({
          ...item,
          roundShare: (item.your / (item.other + item.your)) * 100,
        })
      );

      sharesChart.data = sharesDataTmpUnwrapped;
      return () => {
        sharesChart.dispose();
      };
    }
  }, [shareLogState.data, t]);

  return (
    <>
      <h2>{t('rewards.pplns.title')}</h2>
      <CardGrid>
        <Card padding>
          <CardTitle>
            {t('rewards.pplns.avp.title')}{' '}
            <Tooltip>
              <TooltipContent message={t('rewards.avp.tooltip')} />
            </Tooltip>
          </CardTitle>
          <StatItem
            value={
              averagePoolHashrate &&
              headerStatsData &&
              siFormatter(averagePoolHashrate * headerStatsData.roundShare, {
                unit: 'H/s',
              })
            }
            subValue={
              poolHashrate &&
              headerStatsData &&
              `${t('rewards.pplns.avp.current')}: ${siFormatter(
                poolHashrate * headerStatsData.roundShare,
                { unit: 'H/s' }
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
              headerStatsData &&
              numberFormatter(headerStatsData.roundShare, {
                style: 'percent',
                maximumFractionDigits: 8,
              })
            }
            subValue={
              approximateBlockShare && (
                <>
                  {t('rewards.pplns.crs.aprox')}: {approximateBlockShare}
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
              `${dateUtils.durationWords(
                (shareLogLength * activeCoin.shareDifficulty) /
                  averagePoolHashrate,
                { includeSeconds: true }
              )}`
            }
            subValue={
              averagePoolHashrate &&
              shareLogLength &&
              `${t('rewards.pplns.log.size', {
                value: siFormatter(shareLogLength),
              })} • ${siFormatter(averagePoolHashrate, {
                unit: 'H/s',
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
        <div id="shares-chart" style={{ width: '100%', height: '250px' }}></div>
      </ChartContainer>
    </>
  );
};
