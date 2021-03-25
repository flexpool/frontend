import React from 'react';
import DynamicList from 'src/components/layout/List/List';
import { LinkMiner } from 'src/components/LinkMiner';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { useDispatch } from 'react-redux';
import { donorsGet } from 'src/rdx/topDonors/topDonors.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { dateUtils } from 'src/utils/date.utils';

export const TopDonatorsSection = () => {
  const activeCoin = useActiveCoinTicker();
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
              const displayReward = useActiveCoinTickerDisplayValue(
                data.donated
              );
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
              return <>{dateUtils.formatDistance(data.firstJoined * 1000)}</>;
            },
          },
        ]}
      />
    </>
  );
};
