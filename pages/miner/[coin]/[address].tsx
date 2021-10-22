import React, { useEffect, useState } from 'react';

import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Content } from 'src/components/layout/Content';
import { Page, PageLoading } from 'src/components/layout/Page';

import { useDispatch } from 'react-redux';
import { useReduxState } from 'src/rdx/useReduxState';
import { minerRewardsGet } from 'src/rdx/minerRewards/minerRewards.actions';
import {
  minerDetailsGet,
  minerDetailsReset,
} from 'src/rdx/minerDetails/minerDetails.actions';
import { minerHeaderStatsGet } from 'src/rdx/minerHeaderStats/minerHeaderStats.actions';
import { minerStatsGet } from 'src/rdx/minerStats/minerStats.actions';
import {
  minerStatsChartGet,
  minerStatsChartReset,
} from 'src/rdx/minerStatsChart/minerStatsCharts.actions';
import { minerWorkersGet } from 'src/rdx/minerWorkers/minerWorkers.actions';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { poolStatsGet } from 'src/rdx/poolStats/poolStats.actions';
import {
  useActiveCoin,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';

import { AccountHeader } from 'src/pages/MinerDashboard/Header/AccountHeader';
import { HeaderGreetings } from 'src/pages/MinerDashboard/Header/Greetings';
import { HeaderStats } from 'src/pages/MinerDashboard/Header/Stats';
import { MinerDetails } from 'src/pages/MinerDashboard/Header/MinerDetails';
import { Spacer } from 'src/components/layout/Spacer';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { PullToRefresh } from 'src/components/layout/PullToRefresh/PullToRefresh';
import { InfoBox } from 'src/components/InfoBox';
import AnnouncementBar from '@/components/AnnouncementBar';

import styled from 'styled-components';
import { FaChartBar, FaCube, FaWallet } from 'react-icons/fa';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import useIsMounted from '@/hooks/useIsMounted';
import { getChecksumByTicker } from '@/utils/validators/checksum';
import Warning from '@/assets/warning-icon.svg';
import { fetchApi } from 'src/utils/fetchApi';

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

const TopBannerContainer = styled.div`
  margin: 1rem 0 -1rem;

  & h3 {
    font-size: 1.1rem;
  }

  box-shadow: 0 2px 10px 0 var(--warning-shadow);
`;

const MediaContainer = styled.div`
  display: flex;
  align-items: center;

  & > svg {
    width: 50px;
  }
`;

const BannerText = styled.div`
  margin-left: 1rem;
  flex-grow: 1;

  & > p {
    margin-top: 0.5rem;
  }
`;

export const MinerDashboardPageContent: React.FC<{
  coinTicker: string;
  address: string;
}> = (props) => {
  const { coinTicker, address } = props;
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
    window.location.hash = selectedHash as string;
    return selectedHash;
  };

  const loadHeader = React.useCallback(() => {
    return Promise.all([
      d(minerHeaderStatsGet(coinTicker, address, counterTicker)),
      d(minerDetailsGet(coinTicker, address)),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinTicker, address, counterTicker]);

  const loadMinerStats = React.useCallback(() => {
    return d(
      minerStatsGet(
        coinTicker,
        address,
        typeof worker === 'string' ? worker : undefined
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinTicker, address, worker]);

  const loadMinerChartStats = React.useCallback(() => {
    return d(
      minerStatsChartGet(
        coinTicker,
        address,
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
      d(minerRewardsGet(coinTicker, address, counterTicker));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinTicker, poolCoins?.data, worker, address]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        loadSelectedTabFromHash(window.location.hash.replace(/#/g, ''));
      }
    }
    // useEffect only needs to fire on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    d(minerDetailsReset());
    d(minerStatsChartReset());
  }, [address, d]);

  return (
    <>
      <PullToRefresh
        triggerHeight="auto"
        pullDownThreshold={300}
        onRefresh={loadAll}
      >
        <Page>
          <NextSeo
            title={`${address}`}
            noindex={true}
            openGraph={{
              title: `${address}`,
            }}
          />
          <Content>
            <HeaderGreetings onRefresh={loadAll} />
            <AccountHeader
              coin={activeCoin}
              address={address}
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
                  <DynamicMinerStatsPage address={address} coin={coinTicker} />
                </TabPanel>
                <TabPanel>
                  <DynamicMinerPaymentsPage
                    address={address}
                    coin={coinTicker}
                  />
                </TabPanel>
                <TabPanel>
                  <DynamicMinerRewardsPage address={address} />
                </TabPanel>
                <TabPanel>
                  <DynamicMinerBlocksPage address={address} coin={coinTicker} />
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

// TODO: Testing this prod fix, move these dynamic imports to a separatefile
const DynamicMinerStatsPage = dynamic<{
  address: string;
  coin: string;
}>(
  () =>
    import('src/pages/MinerDashboard/Stats/MinerStats.page').then(
      (module) => module.MinerStatsPage
    ),
  {
    loading: () => (
      <LoaderSpinner center style={{ minHeight: '26rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);

const DynamicMinerPaymentsPage = dynamic<{
  address: string;
  coin: string;
}>(
  () =>
    import('src/pages/MinerDashboard/Payments/MinerPayments.page').then(
      (module) => module.MinerPaymentsPage
    ),
  {
    loading: () => (
      <LoaderSpinner center style={{ minHeight: '26rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);

const DynamicMinerRewardsPage = dynamic<{
  address: string;
}>(
  () =>
    import('src/pages/MinerDashboard/Rewards/MinerRewards.page').then(
      (module) => module.MinerRewardsPage
    ),
  {
    loading: () => (
      <LoaderSpinner center style={{ minHeight: '26rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);

const DynamicMinerBlocksPage = dynamic<{
  address: string;
  coin: string;
}>(
  () =>
    import('src/pages/MinerDashboard/Blocks/MinerBlocks.page').then(
      (module) => module.MinerBlocksPage
    ),
  {
    loading: () => (
      <LoaderSpinner center style={{ minHeight: '26rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);

/**
 * Checking if the address is valid from the database first
 * This wrapps the whole miner page, allowing to do subsequent api fetches
 * when the address really exist
 * @param props
 * @returns
 */
export const MinerDashboardPage: React.FC<{
  address: string;
  coinTicker: string;
  isLocated: boolean;
}> = (props) => {
  const { isLocated } = props;
  const { t } = useTranslation('dashboard');
  const isMounted = useIsMounted();
  const isChineseUser =
    typeof window !== 'undefined'
      ? /^zh\b/.test(window.navigator.language)
      : false;

  return (
    <>
      {isMounted && isChineseUser && (
        <AnnouncementBar>
          公告，我们对 香港(针对中国大陆优化) eth-hke.flexpool.io
          的服务器端口进行了优化和迁移
          <br />
          TCP：从 8080 到 13271
          <br />
          SSL: 从 443 到 22271
          <br />
          如果你仍在使用 8080 或 443 端口，请尽快完成迁移。
        </AnnouncementBar>
      )}
      {!isLocated && (
        <Content>
          <TopBannerContainer>
            <InfoBox variant="warning">
              <MediaContainer>
                <Warning />
                <BannerText>
                  <h3>{t('warning_header')}</h3>
                  <p>{t('warning_description')}</p>
                </BannerText>
              </MediaContainer>
            </InfoBox>
          </TopBannerContainer>
        </Content>
      )}
      <MinerDashboardPageContent {...props} />
    </>
  );
};

export default MinerDashboardPage;

export async function getServerSideProps({ query, locale }) {
  const { coin, address } = query;

  const checkSum = getChecksumByTicker(query.coin)(query.address);

  if (checkSum === null) {
    return {
      redirect: {
        destination: '/not-found',
        permanent: false,
      },
    };
  }

  const res = await fetchApi<string | null>('/miner/locateAddress', {
    query: { address },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'dashboard',
        'blocks',
        'cookie-consent',
      ])),
      coinTicker: coin,
      address,
      isLocated: res !== null,
    },
  };
}
