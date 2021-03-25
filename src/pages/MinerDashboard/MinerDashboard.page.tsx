import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
  Redirect,
} from 'react-router';
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
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaWallet } from 'react-icons/fa';
import { Spacer } from 'src/components/layout/Spacer';

const TabContent = styled.div`
  box-shadow: inset -1px 18px 19px -13px var(--bg-secondary);
  border-top: 2px solid var(--border-color);
  padding-top: 1rem;
`;

const TabLinkContainer = styled(Content)`
  margin-top: 3rem;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
`;

const TabLink = styled(NavLink)`
  font-weight: 600;
  font-size: 1.125rem;
  height: 3rem;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  padding: 0 1.5rem;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  svg {
    margin-right: 0.5rem;
  }
  &.active {
    color: var(--primary);
    border-color: var(--primary);
  }
`;

export const MinerDashboardPage: React.FC<
  RouteComponentProps<{
    coin: string;
    address: string;
  }>
> = (props) => {
  const { coin: coinTicker, address } = props.match.params;
  const activeCoin = useActiveCoin(coinTicker);
  const localSettingsState = useReduxState('localSettings');
  const match = useRouteMatch();

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
      </Content>
      <TabLinkContainer>
        <TabLink to={`${match.url}/stats`}>
          <FaChartBar /> Stats
        </TabLink>
        <TabLink to={`${match.url}/payments`}>
          <FaWallet /> Payments
        </TabLink>
        <TabLink to={`${match.url}/rewards`}>
          <FaChartBar /> Rewards
        </TabLink>
        <TabLink to={`${match.url}/blocks`}>
          <FaWallet /> Blocks
        </TabLink>
      </TabLinkContainer>
      <TabContent>
        <Content>
          <Switch>
            <Route path={`${match.path}/stats`} component={MinerStatsPage} />
            <Redirect to={`${match.path}/stats`} />
          </Switch>
        </Content>
      </TabContent>
      <Spacer size="xl" />
    </Page>
  );
};
