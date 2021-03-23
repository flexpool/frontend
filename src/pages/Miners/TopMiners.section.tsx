import React from 'react';
import { Content } from 'src/components/layout/Content';
import DynamicList from 'src/components/layout/List/List';
import { LinkMiner } from 'src/components/LinkMiner';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { fetchApi } from 'src/utils/fetchApi';
import { formatSi } from 'src/utils/si.utils';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useActiveCoinDisplayValue } from 'src/hooks/useDisplayReward';

type ApiMiner = {
  address: string;
  balance: number;
  donation: number;
  firstJoined: number;
  hashrate: number;
  workerCount: number;
};

export const TopMinersSection = () => {
  const activeCoin = useActiveCoin();
  const minersState = useAsyncState<ApiMiner[]>('miners', []);

  React.useEffect(() => {
    minersState.start(
      fetchApi('/pool/topMiners', { query: { coin: activeCoin } })
    );
  }, [activeCoin]);

  const miners = React.useMemo(() => {
    return minersState.data || [];
  }, [minersState.data]);

  return (
    <>
      <Content paddingLg>
        <h2>Top Miners</h2>
        <br />
        <DynamicList
          isLoading={minersState.isLoading}
          columns={[
            {
              title: 'Miner',
              Component: ({ data }) => {
                return <LinkMiner address={data.address} coin={activeCoin} />;
              },
            },
            {
              title: 'Hashrate',
              Component: ({ data }) => {
                return <>{formatSi(data.hashrate, 'H/s')}</>;
              },
            },
            {
              title: 'Balance',
              Component: ({ data }) => {
                const value = useActiveCoinDisplayValue(data.balance);
                return <>{value}</>;
              },
            },
            {
              title: 'Donation',
              Component: ({ data }) => {
                return <>{data.donation * 100} %</>;
              },
            },
            {
              title: 'Workers',
              Component: ({ data }) => {
                return <>{data.workerCount}</>;
              },
            },
            {
              title: 'Joined',
              Component: ({ data }) => {
                return (
                  <>{formatDistanceToNowStrict(data.firstJoined * 1000)} ago</>
                );
              },
            },
          ]}
          data={miners}
        />
      </Content>
    </>
  );
};
