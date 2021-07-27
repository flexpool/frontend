import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Content } from '../../../src/components/layout/Content';
import { Page, PageLoading } from '../../../src/components/layout/Page';

import { useDispatch } from 'react-redux';
import { useReduxState } from '../../../src/rdx/useReduxState';
import { minerRewardsGet } from '../../../src/rdx/minerRewards/minerRewards.actions';
import { minerDetailsGet } from '../../../src/rdx/minerDetails/minerDetails.actions';
import { minerHeaderStatsGet } from '../../../src/rdx/minerHeaderStats/minerHeaderStats.actions';
import { minerStatsGet } from '../../../src/rdx/minerStats/minerStats.actions';
import { minerStatsChartGet } from '../../../src/rdx/minerStatsChart/minerStatsCharts.actions';
import { minerWorkersGet } from '../../../src/rdx/minerWorkers/minerWorkers.actions';
import { localSettingsSet } from '../../../src/rdx/localSettings/localSettings.actions';
import { poolStatsGet } from '../../../src/rdx/poolStats/poolStats.actions';
import {
  useActiveCoin,
  useCounterTicker,
} from '../../../src/rdx/localSettings/localSettings.hooks';

import { AccountHeader } from '../../../src/pages/MinerDashboard/Header/AccountHeader';
import { HeaderGreetings } from '../../../src/pages/MinerDashboard/Header/Greetings';
import { HeaderStats } from '../../../src/pages/MinerDashboard/Header/Stats';
import { MinerDetails } from '../../../src/pages/MinerDashboard/Header/MinerDetails';
import { MinerStatsPage } from '../../../src/pages/MinerDashboard/Stats/MinerStats.page';
import { MinerPaymentsPage } from '../../../src/pages/MinerDashboard/Payments/MinerPayments.page';
import { Spacer } from '../../../src/components/layout/Spacer';
import { MinerBlocksPage } from '../../../src/pages/MinerDashboard/Blocks/MinerBlocks.page';
import { MinerRewardsPage } from '../../../src/pages/MinerDashboard/Rewards/MinerRewards.page';
import { LoaderSpinner } from '../../../src/components/Loader/LoaderSpinner';
import { PullToRefresh } from '../../../src/components/layout/PullToRefresh/PullToRefresh';

import styled from 'styled-components';
import { FaChartBar, FaCube, FaWallet } from 'react-icons/fa';
import { useActiveSearchParamWorker } from '../../../src/hooks/useActiveQueryWorker';
import { useAsyncState } from '../../../src/hooks/useAsyncState';
import { fetchApi } from '../../../src/utils/fetchApi';
import { useTranslation } from 'next-i18next';

const TabContent = styled.div`
  box-shadow: inset -1px 18px 19px -13px var(--bg-secondary);
  border-top: 2px solid var(--border-color);
  padding-top: 2rem;
`;

const TabLinkContainer = styled(TabList)`
  margin-top: 3rem;
  display: flex;
  overflow-x: auto;
`;

const TabLink = styled(Tab)`
  font-weight: 600;
  font-size: 1.125rem;
  height: 3rem;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  padding: 0 1.5rem;
  border-bottom: 2px solid transparent;
  margin: 0;
  cursor: pointer;

  position: relative;
  z-index: 1;
  svg {
    margin-right: 0.5rem;
  }
  &[aria-selected='true'] {
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

export const MinerDashboardPageContent: React.FC<{
  coinTicker: string;
  address: string;
}> = (props) => {
  const { coinTicker, address } = props;
  // const router = useRouter();
  // const { coin: coinTicker, address } = router.query;
  const poolCoins = useReduxState('poolCoins');
  const activeCoin = useActiveCoin(coinTicker);
  const counterTicker = useCounterTicker();
  const { t } = useTranslation('dashboard');

  const d = useDispatch();

  const worker = useActiveSearchParamWorker();

  const [tabIndex, setTabIndex] = useState(0);

  const tabs = {
    stats: 0,
    payments: 1,
    rewards: 2,
    blocks: 3,
  };

  const loadSelectedTabFromHash = (tabHash: string) => {
    setTabIndex(tabs[tabHash]);
    return tabs[tabHash];
  };

  const selectTab = (index: number) => {
    setTabIndex(index);
    const selectedHash = Object.keys(tabs).find((key) => tabs[key] === index);
    window.location.hash = selectedHash;
    return selectedHash;
  };

  const loadHeader = React.useCallback(() => {
    return Promise.all([
      d(minerHeaderStatsGet(coinTicker, address[0], counterTicker)),
      d(minerDetailsGet(coinTicker, address[0])),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinTicker, address, counterTicker]);

  const loadMinerStats = React.useCallback(() => {
    return d(
      minerStatsGet(
        coinTicker,
        address[0],
        typeof worker === 'string' ? worker : undefined
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinTicker, address, worker]);

  const loadMinerChartStats = React.useCallback(() => {
    return d(
      minerStatsChartGet(
        coinTicker,
        address[0],
        typeof worker === 'string' ? worker : undefined
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinTicker, address, worker]);

  const loadAll = React.useCallback(() => {
    return Promise.all([loadMinerStats(), loadHeader(), loadMinerChartStats()]);
  }, [loadMinerStats, loadHeader, loadMinerChartStats]);

  // globaly set active coin ticker
  useEffect(() => {
    if (
      poolCoins.data &&
      poolCoins.data.coins.find((item) => item.ticker === coinTicker)
    ) {
      d(localSettingsSet({ coin: coinTicker }));
      d(poolStatsGet(coinTicker));
      loadHeader();
      loadMinerStats();
      loadMinerChartStats();
      d(minerWorkersGet(coinTicker, address));
      d(minerRewardsGet(coinTicker, address[0], counterTicker));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinTicker, poolCoins?.data]);

  useEffect(() => {
    // console.log(props);

    if (window !== typeof undefined) {
      if (window.location.hash) {
        loadSelectedTabFromHash(window.location.hash.replace(/#/g, ''));
      }
    }
  }, []);

  return (
    <>
      <PullToRefresh
        triggerHeight="auto"
        pullDownThreshold={300}
        onRefresh={loadAll}
      >
        <Page>
          <Head titleTemplate={`${address} | %s | Flexpool.io`}>
            <title>Dashboard</title>
          </Head>
          <Content>
            <HeaderGreetings onRefresh={loadAll} />
            <AccountHeader
              coin={activeCoin}
              address={address[0]}
              onRefresh={loadAll}
            />
            <Spacer />
            <MinerDetails coin={activeCoin} />
            <HeaderStats coin={activeCoin} />
          </Content>
          <Tabs
            className="w-full"
            selectedIndex={tabIndex}
            onSelect={(index) => selectTab(index)}
          >
            <Content>
              <TabLinkContainer>
                <TabLink>
                  <FaChartBar /> {t('nav.stats')}
                </TabLink>
                <TabLink>
                  <FaWallet /> {t('nav.payments')}
                </TabLink>
                <TabLink>
                  <FaChartBar /> {t('nav.rewards')}
                </TabLink>
                <TabLink>
                  <FaCube /> {t('nav.blocks')}
                </TabLink>
              </TabLinkContainer>
            </Content>
            <TabContent id="workertabs">
              <Content>
                <TabPanel>
                  <MinerStatsPage address={address[0]} coin={coinTicker} />
                </TabPanel>
                <TabPanel>
                  <MinerPaymentsPage address={address[0]} coin={coinTicker} />
                </TabPanel>
                <TabPanel>
                  <MinerRewardsPage address={address[0]} />
                </TabPanel>
                <TabPanel>
                  <MinerBlocksPage address={address[0]} coin={coinTicker} />
                </TabPanel>
              </Content>
            </TabContent>
          </Tabs>
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
export const MinerDashboardPage: React.FC<{
  addressState: string;
  coinTicker: string;
}> = (props) => {
  const { addressState, coinTicker } = props;
  const router = useRouter();
  // const { coin: coinTicker, address } = router.query;
  const locateAddressState = useAsyncState<string | null>();

  // React.useEffect(() => {
  //   locateAddressState.start(
  //     fetchApi<string | null>('/miner/locateAddress', {
  //       query: { address },
  //     }).then((res) => {
  //       if (res !== coinTicker) {
  //         // not found
  //         return Promise.reject({
  //           message: 'Address not found',
  //         });
  //       }
  //       localSettingsSet({ coin: res });
  //       return res;
  //     })
  //   );
  //   // eslint-disable-next-line
  // }, [coinTicker, address]);

  if (locateAddressState.error) {
    router.push('/not-found');
  }

  /**
   * Still loading
   */
  if (addressState !== coinTicker) {
    return (
      <PageLoading>
        <LoaderSpinner />
      </PageLoading>
    );
  }

  return <MinerDashboardPageContent {...props} />;
};

export default MinerDashboardPage;

export async function getServerSideProps({ query, locale }) {
  // console.log(query);
  const addressState = await fetchApi<string | null>('/miner/locateAddress', {
    query: { address: query.address },
  }).then((res) => {
    if (res !== query.coin) {
      // not found
      return Promise.reject({
        message: 'Address not found',
      });
    }

    // console.log(res);
    return res;
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'dashboard',
        'blocks',
        'cookie-consent',
      ])),
      coinTicker: query.coin,
      address: query.address,
      addressState: addressState,
    },
  };
}
