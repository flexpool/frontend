import React, { useEffect, useState } from 'react';

import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Content } from 'src/components/layout/Content';
import { Page, PageLoading } from 'src/components/layout/Page';

import { useReduxState } from 'src/rdx/useReduxState';
import { useFetchMinerRewards } from '@/rdx/minerRewards/minerRewards.hooks';
import { useFetchMinerDetails } from '@/rdx/minerDetails/minerDetails.hooks';
import { useFetchMinerHeaderStats } from '@/rdx/minerHeaderStats/minerHeaderStats.hooks';
import { useFetchMinerStats } from '@/rdx/minerStats/minerStats.hooks';
import { useFetchMinerStatsChart } from '@/rdx/minerStatsChart/minerStatsChart.hooks';
import { useFetchMinerWorkers } from 'src/rdx/minerWorkers/minerWorkers.hooks';
import {
  useActiveCoin,
  useCounterTicker,
  useCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';

import { AccountHeader } from 'src/pages/MinerDashboard/Header/AccountHeader';
import { HeaderGreetings } from 'src/pages/MinerDashboard/Header/Greetings';
import { HeaderStats } from 'src/pages/MinerDashboard/Header/Stats';
import { MinerDetails } from 'src/pages/MinerDashboard/Header/MinerDetails';
import { Spacer } from 'src/components/layout/Spacer';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { PullToRefresh } from 'src/components/layout/PullToRefresh/PullToRefresh';
import { InfoBox } from 'src/components/InfoBox';

import styled from 'styled-components';
import { FaChartBar, FaCube, FaWallet } from 'react-icons/fa';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
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
  const [, setCoinTicker] = useCoinTicker();
  const worker = useActiveSearchParamWorker();
  const { refetch: refetchMinerWorkers } = useFetchMinerWorkers(
    coinTicker,
    address
  );
  const { refetch: refetchMinerRewards } = useFetchMinerRewards(
    coinTicker,
    address,
    counterTicker
  );
  const { refetch: refetchMinerStatsChart } = useFetchMinerStatsChart(
    coinTicker,
    address,
    worker
  );
  const { refetch: refetchMinerStats } = useFetchMinerStats(
    coinTicker,
    address,
    worker
  );
  const { refetch: refetchMinerHeaderStats } = useFetchMinerHeaderStats(
    coinTicker,
    address,
    counterTicker
  );
  const { refetch: refetchMinerDetails } = useFetchMinerDetails(
    coinTicker,
    address
  );

  const loadAll = React.useCallback(() => {
    return Promise.all([
      refetchMinerDetails(),
      refetchMinerWorkers(),
      refetchMinerRewards(),
      refetchMinerStatsChart(),
      refetchMinerStats(),
      refetchMinerHeaderStats(),
    ]);
  }, [
    refetchMinerDetails,
    refetchMinerWorkers,
    refetchMinerRewards,
    refetchMinerStatsChart,
    refetchMinerStats,
    refetchMinerHeaderStats,
  ]);

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

  useEffect(() => {
    if (
      poolCoins.data &&
      poolCoins.data.coins.find((item) => item.ticker === coinTicker)
    ) {
      setCoinTicker(coinTicker);
    }
  }, [poolCoins.data, setCoinTicker, coinTicker]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        loadSelectedTabFromHash(window.location.hash.replace(/#/g, ''));
      }
    }
    // useEffect only needs to fire on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <HeaderStats coin={activeCoin} coinTicker={coinTicker} />
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
                  <DynamicMinerRewardsPage
                    address={address}
                    coinTicker={coinTicker}
                  />
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
  coinTicker: string;
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

  return (
    <>
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
