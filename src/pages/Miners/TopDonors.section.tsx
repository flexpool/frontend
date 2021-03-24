import React from 'react';
import DynamicList from 'src/components/layout/List/List';
import { LinkMiner } from 'src/components/LinkMiner';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useActiveCoinDisplayValue } from 'src/hooks/useDisplayReward';
import { useDispatch } from 'react-redux';
import { donorsGet } from 'src/rdx/topDonors/topDonors.actions';
import { useReduxState } from 'src/rdx/useReduxState';

export const TopDonatorsSection = () => {
  const activeCoin = useActiveCoin();
  const donorsState = useReduxState('donors');
  const d = useDispatch();

  React.useEffect(() => {
    d(donorsGet(activeCoin));
  }, [activeCoin, d]);

  return (
    <>
      <h2>Top Miners</h2>
      <br />
      <DynamicList
        isLoading={donorsState.isLoading}
        loadingRowsCount={10}
        data={donorsState.data}
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
            skeletonWidth: 60,
            Component: ({ data }) => {
              return <>{data.donation * 100} %</>;
            },
          },
          {
            title: 'Joined',
            skeletonWidth: 120,
            Component: ({ data }) => {
              return (
                <>{formatDistanceToNowStrict(data.firstJoined * 1000)} ago</>
              );
            },
          },
        ]}
      />
    </>
  );
};
