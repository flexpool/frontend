import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { HeaderStat } from 'src/components/layout/StatHeader';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { poolStatsGet } from 'src/rdx/poolStats/poolStats.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import styled from 'styled-components/macro';
import PoolHashrateChart from './PoolHashRate.chart';

const Hero = styled.div`
  /* background: var(--primary); */
`;

// const defaultState: [{ total: number }, number, number, number] = [
//   { total: 0 },
//   0,
//   0,
//   0,
// ];

export const StatisticsPage = () => {
  const d = useDispatch();

  const activeTicker = useActiveCoinTicker();
  React.useEffect(() => {
    d(poolStatsGet(activeTicker));
  }, [activeTicker, d]);

  const poolStatsState = useReduxState('poolStats');
  const { t, i18n } = useTranslation('statistics');
  const siFormatter = useLocalizedSiFormatter();

  const averageLuck =
    Math.round((poolStatsState.data?.averageLuck || 0) * 100 * 10) / 10;

  return (
    <Page>
      <Hero>
        <Helmet>
          <title>{t('head_title')}</title>
        </Helmet>
        <HeaderStat>
          <h1>{t('title')}</h1>
        </HeaderStat>
        <Content>
          <StatBoxContainer>
            <StatBox
              title={t('pool_hashrate')}
              value={siFormatter(poolStatsState.data?.hashrate.total, {
                unit: 'H/s',
              })}
            />
            <StatBox
              title={t('average_luck')}
              tooltip={
                <Tooltip>
                  <TooltipContent>{t('average_luck_tooltip')}</TooltipContent>
                </Tooltip>
              }
              value={
                poolStatsState.data?.averageLuck &&
                `${Intl.NumberFormat(i18n.language).format(averageLuck)}%`
              }
            />
            <StatBox
              title={t('miners')}
              value={
                poolStatsState.data?.minerCount &&
                Intl.NumberFormat(i18n.language).format(
                  poolStatsState.data?.minerCount
                )
              }
            />
            <StatBox
              title={t('workers')}
              value={
                poolStatsState.data?.workerCount &&
                Intl.NumberFormat(i18n.language).format(
                  poolStatsState.data?.workerCount
                )
              }
            />
          </StatBoxContainer>
        </Content>
        <Content>
          <PoolHashrateChart />
        </Content>
        <Spacer size="xl" />
      </Hero>
    </Page>
  );
};

export default StatisticsPage;
