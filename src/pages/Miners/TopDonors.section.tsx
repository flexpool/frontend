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

type ApiDonor = {
  address: string;
  donation: number;
  donated: number;
  firstJoined: number;
};

export const TopDonatorsSection = () => {
  const activeCoin = useActiveCoin();
  const minersState = useAsyncState<ApiDonor[]>('donors', []);

  React.useEffect(() => {
    minersState.start(
      fetchApi('/pool/topDonators', { query: { coin: activeCoin } })
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
          loadingRowsCount={10}
          columns={[
            {
              title: 'Miner',
              skeletonWidth: 200,
              Component: ({ data }) => {
                return <LinkMiner address={data.address} coin={activeCoin} />;
              },
            },
            {
              title: 'Total Donated',
              Component: ({ data }) => {
                const displayReward = useActiveCoinDisplayValue(data.donated);
                return <>{displayReward}</>;
              },
            },
            {
              title: 'Donation',
              Component: ({ data }) => {
                return <>{data.donation * 100} %</>;
              },
            },
            {
              title: 'Joined',
              skeletonWidth: 150,
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
