import React from 'react';
import DynamicList from 'src/components/layout/List/List';
import { LinkMiner } from 'src/components/LinkMiner';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { formatSi } from 'src/utils/si.utils';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { useReduxState } from 'src/rdx/useReduxState';
import { useDispatch } from 'react-redux';
import { topMinersGet } from 'src/rdx/topMiners/topMiners.actions';
import { Mono, Ws } from 'src/components/Typo/Typo';

export const TopMinersSection = () => {
  const activeCoin = useActiveCoinTicker();
  const minersState = useReduxState('topMiners');
  const d = useDispatch();

  React.useEffect(() => {
    d(topMinersGet(activeCoin));
  }, [activeCoin, d]);

  return (
    <>
      <h2>Top Miners</h2>
      <DynamicList
        isLoading={minersState.isLoading}
        data={minersState.data}
        columns={[
          {
            title: 'Miner',
            skeletonWidth: 200,
            Component: ({ data }) => {
              return <LinkMiner address={data.address} coin={activeCoin} />;
            },
          },
          {
            title: 'Hashrate',
            skeletonWidth: 90,
            Component: ({ data }) => {
              return (
                <Ws>
                  <Mono>{formatSi(data.hashrate, 'H/s')}</Mono>
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
            title: 'Donation',
            skeletonWidth: 60,
            Component: ({ data }) => {
              return <>{data.donation * 100} %</>;
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
              return (
                <Ws>
                  {formatDistanceToNowStrict(data.firstJoined * 1000)} ago
                </Ws>
              );
            },
          },
        ]}
      />
    </>
  );
};
