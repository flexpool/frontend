import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { Spacer } from '../src/components/layout/Spacer';
import { HeaderStat } from '../src/components/layout/StatHeader';
import { Luck } from '../src/components/Luck';
import { StatBox, StatBoxContainer } from '../src/components/StatBox';
import { Tooltip, TooltipContent } from '../src/components/Tooltip';
import PoolHashrateChart from '../src/pages/Statistics/components/PoolHashRateChart/PoolHashRate.chart';

// Redux
import { useDispatch } from 'react-redux';
import {
  useActiveCoinTicker,
  useActiveCoin,
} from '../src/rdx/localSettings/localSettings.hooks';
import { poolStatsGet } from '../src/rdx/poolStats/poolStats.actions';
import { useReduxState } from '../src/rdx/useReduxState';

// Utils
import {
  useLocalizedNumberFormatter,
  useLocalizedSiFormatter,
} from '../src/utils/si.utils';

function StatisticsPage() {
  const d = useDispatch();

  const activeTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  React.useEffect(() => {
    if (activeTicker) {
      d(poolStatsGet(activeTicker));
    }
  }, [activeTicker, d]);

  const poolStatsState = useReduxState('poolStats');
  const { t } = useTranslation('statistics');
  const siFormatter = useLocalizedSiFormatter();
  const numberFormatter = useLocalizedNumberFormatter();

  return (
    <Page>
      {/* <Helmet>
        <title>{t('head_title')}</title>
      </Helmet> */}
      <HeaderStat>
        <h1>{t('title')}</h1>
      </HeaderStat>
      <Content>
        <StatBoxContainer>
          <StatBox
            title={t(
              activeCoin?.hashrateUnit === 'B' ? 'pool_space' : 'pool_hashrate'
            )}
            value={siFormatter(poolStatsState.data?.hashrate.total, {
              unit: activeCoin?.hashrateUnit,
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
              poolStatsState.data?.averageLuck && (
                <Luck value={poolStatsState.data?.averageLuck} />
              )
            }
          />
          <StatBox
            title={t('miners')}
            value={
              poolStatsState.data?.minerCount &&
              numberFormatter(poolStatsState.data?.minerCount)
            }
          />
          <StatBox
            title={t('workers')}
            value={
              poolStatsState.data?.workerCount &&
              numberFormatter(poolStatsState.data?.workerCount)
            }
          />
        </StatBoxContainer>
      </Content>
      <Content>
        <PoolHashrateChart />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
}

export default StatisticsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'statistics',
        'cookie-consent',
      ])),
    },
  };
}
