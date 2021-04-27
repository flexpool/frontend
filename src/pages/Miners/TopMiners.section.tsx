import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { LinkMiner } from 'src/components/LinkMiner';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useReduxState } from 'src/rdx/useReduxState';
import { useDispatch } from 'react-redux';
import { topMinersGet } from 'src/rdx/topMiners/topMiners.actions';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { ApiTopMiner } from 'src/types/TopMiner.types';
import { dateUtils } from 'src/utils/date.utils';
import { useTranslation } from 'react-i18next';

export const TopMinersSection = () => {
  const activeCoinTicker = useActiveCoinTicker();
  const minersState = useReduxState('topMiners');
  const d = useDispatch();
  const { t } = useTranslation('miners');

  React.useEffect(() => {
    d(topMinersGet(activeCoinTicker));
  }, [activeCoinTicker, d]);
  const siFormatter = useLocalizedSiFormatter();
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();

  const topMinersCol: DynamicListColumn<
    ApiTopMiner,
    { coinTicker: string }
  >[] = React.useMemo(
    () => [
      {
        title: t('top_miners.table_head.miner'),
        skeletonWidth: 200,
        Component: ({ data, config }) => {
          return (
            <Mono>
              <Ws>
                <LinkMiner
                  chars={16}
                  address={data.address}
                  coin={config.coinTicker}
                />
              </Ws>
            </Mono>
          );
        },
      },
      {
        title: t('top_miners.table_head.hashrate'),
        skeletonWidth: 90,
        Component: ({ data }) => {
          return (
            <Ws>
              <Mono>{siFormatter(data.hashrate, { unit: 'H/s' })}</Mono>
            </Ws>
          );
        },
      },
      {
        title: t('top_miners.table_head.balance'),
        skeletonWidth: 75,
        Component: ({ data }) => {
          return (
            <Ws>
              <Mono>{activeCoinFormatter(data.balance)}</Mono>
            </Ws>
          );
        },
      },
      {
        title: t('top_miners.table_head.workers'),
        skeletonWidth: 60,
        Component: ({ data }) => {
          return <>{data.workerCount}</>;
        },
      },
      {
        title: t('top_miners.table_head.joined'),
        skeletonWidth: 120,
        Component: ({ data }) => {
          return <Ws>{dateUtils.formatDistance(data.firstJoined * 1000)}</Ws>;
        },
      },
    ],
    [siFormatter, activeCoinFormatter, t]
  );

  return (
    <>
      <h2>{t('top_miners.title')}</h2>
      <DynamicList
        isLoading={minersState.isLoading}
        data={minersState.data}
        columns={topMinersCol}
        config={{
          coinTicker: activeCoinTicker,
        }}
      />
    </>
  );
};
