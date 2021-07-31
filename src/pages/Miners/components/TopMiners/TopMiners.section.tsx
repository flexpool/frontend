import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { LinkMiner } from 'src/components/LinkMiner';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useReduxState } from 'src/rdx/useReduxState';
import { useDispatch } from 'react-redux';
import { topMinersGet } from 'src/rdx/topMiners/topMiners.actions';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { ApiTopMiner } from 'src/types/TopMiner.types';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import { useTranslation } from 'next-i18next';
// import { useHistory } from 'react-router';
import { useRouter } from 'next/router';

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
  const activeCoin = useActiveCoin();

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
                  className="item-hover-higjlight"
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
        title:
          activeCoin?.hashrateUnit === 'B'
            ? t('top_miners.table_head.space')
            : t('top_miners.table_head.hashrate'),
        skeletonWidth: 90,
        Component: ({ data }) => {
          return (
            <Ws>
              <Mono>
                {siFormatter(data.hashrate, { unit: activeCoin?.hashrateUnit })}
              </Mono>
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
          const dateFormatter = useLocalizedDateFormatter();
          return (
            <Ws>{dateFormatter.distanceFromNow(data.firstJoined * 1000)}</Ws>
          );
        },
      },
    ],
    [siFormatter, activeCoinFormatter, t, activeCoin]
  );
  // const { push } = useHistory();
  const router = useRouter();
  const handleMinerClick = React.useCallback(
    (miner: ApiTopMiner) => {
      router.push(`/miner/${activeCoinTicker}/${miner.address}`);
    },
    [router, activeCoinTicker]
  );

  return (
    <>
      <h2>{t('top_miners.title')}</h2>
      <DynamicList
        isLoading={minersState.isLoading}
        data={minersState.data}
        columns={topMinersCol}
        onRowClick={handleMinerClick}
        config={{
          coinTicker: activeCoinTicker,
        }}
      />
    </>
  );
};
