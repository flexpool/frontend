import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { LinkMiner } from 'src/components/LinkMiner';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { useReduxState } from 'src/rdx/useReduxState';
import { useDispatch } from 'react-redux';
import { topMinersGet } from 'src/rdx/topMiners/topMiners.actions';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { ApiTopMiner } from 'src/types/TopMiner.types';
import { dateUtils } from 'src/utils/date.utils';

export const TopMinersSection = () => {
  const activeCoinTicker = useActiveCoinTicker();
  const minersState = useReduxState('topMiners');
  const d = useDispatch();

  React.useEffect(() => {
    d(topMinersGet(activeCoinTicker));
  }, [activeCoinTicker, d]);
  const siFormatter = useLocalizedSiFormatter();

  const topMinersCol: DynamicListColumn<
    ApiTopMiner,
    { coinTicker: string }
  >[] = React.useMemo(
    () => [
      {
        title: 'Miner',
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
        title: 'Hashrate',
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
        title: 'Balance',
        skeletonWidth: 75,
        Component: ({ data }) => {
          const value = useActiveCoinTickerDisplayValue(data.balance);
          return (
            <Ws>
              <Mono>{value}</Mono>
            </Ws>
          );
        },
      },
      {
        title: 'Workers',
        skeletonWidth: 60,
        Component: ({ data }) => {
          return <>{data.workerCount}</>;
        },
      },
      {
        title: 'Joined',
        skeletonWidth: 120,
        Component: ({ data }) => {
          return <Ws>{dateUtils.formatDistance(data.firstJoined * 1000)}</Ws>;
        },
      },
    ],
    [siFormatter]
  );

  return (
    <>
      <h2>Top Miners</h2>
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
