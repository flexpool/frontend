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
import { Page, PageLoading } from 'src/components/layout/Page';
import {
  useActiveCoin,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { minerDetailsGet } from 'src/rdx/minerDetails/minerDetails.actions';
import { minerHeaderStatsGet } from 'src/rdx/minerHeaderStats/minerHeaderStats.actions';
import { minerStatsGet } from 'src/rdx/minerStats/minerStats.actions';
import { AccountHeader } from './Header/AccountHeader';
import { HeaderGreetings } from './Header/Greetings';
import { HeaderStats } from './Header/Stats';
import { MinerDetails } from './Header/MinerDetails';
import { MinerStatsPage } from './Stats/MinerStats.page';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaCube, FaWallet } from 'react-icons/fa';
import { Spacer } from 'src/components/layout/Spacer';
import { MinerPaymentsPage } from './Payments/MinerPayments.page';
import { Helmet } from 'react-helmet-async';
import { MinerBlocksPage } from './Blocks/MinerBlocks.page';
import { MinerRewardsPage } from './Rewards/MinerRewards.page';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { useTranslation } from 'react-i18next';
import { PullToRefresh } from 'src/components/layout/PullToRefresh/PullToRefresh';

const TabContent = styled.div`
  box-shadow: inset -1px 18px 19px -13px var(--bg-secondary);
  border-top: 2px solid var(--border-color);
  padding-top: 2rem;
`;

const TabLinkContainer = styled(Content)`
  margin-top: 3rem;
  display: flex;
  overflow-x: auto;
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

  position: relative;
  z-index: 1;
  svg {
    margin-right: 0.5rem;
  }
  &.active {
    color: var(--primary);
    border-color: var(--primary);
  }

  &:hover {
    background: rgba(128, 128, 128, 0.04);
    color: var(--primary);
  }
  &:active {
    background: rgba(128, 128, 128, 0.07);
  }
  text-decoration: none !important;
`;

export const MinerDashboardPageContent: React.FC<
  RouteComponentProps<{
    coin: string;
    address: string;
  }>
> = (props) => {
  const { coin: coinTicker, address } = props.match.params;
  const poolCoins = useReduxState('poolCoins');
  const activeCoin = useActiveCoin(coinTicker);
  const match = useRouteMatch();
  const counterTicker = useCounterTicker();
  const { t } = useTranslation('dashboard');

  const d = useDispatch();

  // globaly set active coin ticker
  React.useEffect(() => {
    if (
      poolCoins.data &&
      poolCoins.data.coins.find((item) => item.ticker === coinTicker)
    ) {
      d(localSettingsSet({ coin: coinTicker }));
    }
  }, [coinTicker, d, poolCoins.data]);

  const worker = useActiveSearchParamWorker();

  const loadHeader = React.useCallback(() => {
    return Promise.all([
      d(minerHeaderStatsGet(coinTicker, address, counterTicker)),
      d(minerDetailsGet(coinTicker, address)),
    ]);
  }, [coinTicker, address, d, counterTicker]);

  const loadMinerStats = React.useCallback(() => {
    return d(
      minerStatsGet(
        coinTicker,
        address,
        typeof worker === 'string' ? worker : undefined
      )
    );
  }, [coinTicker, address, d, worker]);

  const loadAll = React.useCallback(() => {
    return Promise.all([loadMinerStats(), loadHeader()]);
  }, [loadMinerStats, loadHeader]);

  React.useEffect(() => {
    loadHeader();
    // eslint-disable-next-line
  }, [loadHeader]);

  React.useEffect(() => {
    loadMinerStats();
  }, [loadMinerStats]);

  return (
    <>
      <PullToRefresh
        triggerHeight="auto"
        pullDownThreshold={100}
        onRefresh={loadAll}
      >
        <Page>
          <Helmet titleTemplate={`${address} | %s | Flexpool.io`}>
            <title>Dashboard</title>
          </Helmet>
          <Content>
            <HeaderGreetings coin={activeCoin} />
            <AccountHeader coin={activeCoin} address={address} />
            <Spacer />
            <MinerDetails coin={activeCoin} />
            <HeaderStats coin={activeCoin} />
          </Content>
          <TabLinkContainer>
            <TabLink
              to={{
                pathname: `${match.url}/stats`,
                state: {
                  noscroll: true,
                },
              }}
            >
              <FaChartBar /> {t('nav.stats')}
            </TabLink>
            <TabLink
              to={{
                pathname: `${match.url}/payments`,
                state: { noscroll: true },
              }}
            >
              <FaWallet /> {t('nav.payments')}
            </TabLink>
            <TabLink
              to={{
                pathname: `${match.url}/rewards`,
                state: { noscroll: true },
              }}
            >
              <FaChartBar /> {t('nav.rewards')}
            </TabLink>
            <TabLink
              to={{
                pathname: `${match.url}/blocks`,
                state: { noscroll: true },
              }}
            >
              <FaCube /> {t('nav.blocks')}
            </TabLink>
          </TabLinkContainer>
          <TabContent id="workertabs">
            <Content>
              <Switch>
                <Route
                  path={`${match.path}/stats`}
                  component={MinerStatsPage}
                />
                <Route
                  path={`${match.path}/blocks`}
                  component={MinerBlocksPage}
                />
                <Route
                  path={`${match.path}/rewards`}
                  component={MinerRewardsPage}
                />
                <Route
                  path={`${match.path}/payments`}
                  component={MinerPaymentsPage}
                />
                <Redirect to={`${match.path}/stats`} />
              </Switch>
            </Content>
          </TabContent>
          <Spacer size="xl" />
        </Page>
      </PullToRefresh>
    </>
  );
};

/**
 * Checking if the address is valid from the database first
 * This wrapps the whole miner page, allowing to do subsequent api fetches
 * when the address really exist
 * @param props
 * @returns
 */
export const MinerDashboardPage: React.FC<
  RouteComponentProps<{
    coin: string;
    address: string;
  }>
> = (props) => {
  const { coin: coinTicker, address } = props.match.params;
  const locateAddressState = useAsyncState<string | null>();

  React.useEffect(() => {
    locateAddressState.start(
      fetchApi<string | null>('/miner/locateAddress', {
        query: { address },
      }).then((res) => {
        if (res !== coinTicker) {
          // not found
          return Promise.reject({
            message: 'Address not found',
          });
        }
        return res;
      })
    );
    // eslint-disable-next-line
  }, [coinTicker, address]);

  if (locateAddressState.error) {
    return <Redirect to="/not-found" />;
  }

  /**
   * Still loading
   */
  if (locateAddressState.data !== coinTicker) {
    return (
      <PageLoading>
        <LoaderSpinner />
      </PageLoading>
    );
  }

  return <MinerDashboardPageContent {...props} />;
};

export default MinerDashboardPage;
