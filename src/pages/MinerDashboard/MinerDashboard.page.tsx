import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { minerDetailsGet } from 'src/rdx/minerDetails/minerDetails.actions';
import { minerHeaderStatsGet } from 'src/rdx/minerHeaderStats/minerHeaderStats.actions';
import { minerStatsGet } from 'src/rdx/minerStats/minerStats.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { AccountHeader } from './Header/AccountHeader';
import { HeaderGreetings } from './Header/Greetings';
import { HeaderStats } from './Header/Stats';
import { MinerDetails } from './Header/MinerDetails';
import { MinerStatsPage } from './Stats/MinerStats.page';

export const MinerDashboardPage: React.FC<
  RouteComponentProps<{
    coin: string;
    address: string;
  }>
> = (props) => {
  const { coin: coinTicker, address } = props.match.params;
  const activeCoin = useActiveCoin(coinTicker);
  const localSettingsState = useReduxState('localSettings');

  const d = useDispatch();

  React.useEffect(() => {
    d(
      minerHeaderStatsGet(coinTicker, address, localSettingsState.counterTicker)
    );
    d(minerDetailsGet(coinTicker, address));
    d(minerStatsGet(coinTicker, address));
  }, [coinTicker, address, d, localSettingsState.counterTicker]);

  return (
    <Page>
      <Content>
        <HeaderGreetings coin={activeCoin} />
        <AccountHeader coin={activeCoin} address={address} />
        <MinerDetails coin={activeCoin} />
        <HeaderStats coin={activeCoin} />
        <MinerStatsPage />
      </Content>
    </Page>
  );
};
