import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import AnnouncementBar from '@/components/AnnouncementBar';

import {
  useActiveCoin,
  useCounterTicker,
  useCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';

import usePoolCoinsQuery from '@/hooks/api/usePoolCoinsQuery';

import AccountHeader from 'src/pages/MinerDashboard/Header/AccountHeader';
import { HeaderGreetings } from 'src/pages/MinerDashboard/Header/Greetings';
import { HeaderStats } from 'src/pages/MinerDashboard/Header/Stats';
import { MinerDetails } from 'src/pages/MinerDashboard/Header/MinerDetails';
import TimeToLambo from '@/pages/MinerDashboard/Header/TimeToLambo';
import { Spacer } from 'src/components/layout/Spacer';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { PullToRefresh } from 'src/components/layout/PullToRefresh/PullToRefresh';
import { InfoBox } from 'src/components/InfoBox';
import FlexFarmerAnnouncement from '@/pages/MinerDashboard/Announcements/FlexFarmerAnnouncement';

import styled from 'styled-components';
import { FaChartBar, FaCube, FaWallet } from 'react-icons/fa';
import { getChecksumByTicker } from '@/utils/validators/checksum';
import Warning from '@/assets/warning-icon.svg';
import { fetchApi } from 'src/utils/fetchApi';

const DONATION_ADDRESS = '0x165CD37b4C644C2921454429E7F9358d18A45e14';

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

const DonationAnnouncement = styled(AnnouncementBar)`
  border-top: 9px solid #005bb9;
  border-bottom: 8px solid #ffd302;
`;

const ETCAnnouncement = styled(AnnouncementBar)`
  padding: 1rem 0;
`;

const ETCCallToAction = styled.a`
  border: 1px solid white;
  text-decoration: none;
  padding: 0.25rem 0.4rem;
  border-radius: 4px;
  color: white;
  font-size: 0.85rem;
  margin-left: 0.25rem;

  &:hover {
    text-decoration: none;
  }
`;

export const MinerDashboardPageContent: React.FC<{
  coinTicker: string;
  address: string;
}> = (props) => {
  const { coinTicker, address } = props;
  const { data: poolCoins } = usePoolCoinsQuery();
  const queryClient = useQueryClient();
  const activeCoin = useActiveCoin(coinTicker);
  const counterTicker = useCounterTicker();
  const { t } = useTranslation('dashboard');
  const [, setCoinTicker] = useCoinTicker();

  const [tabIndex, setTabIndex] = useState(0);
  const tabs = {
    stats: 0,
    payments: 1,
    rewards: 2,
    blocks: 3,
  };

  // TODO: Provide a miner address oriented query key handler
  const loadAll = React.useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries(['/miner/balance', { address }]),
      queryClient.invalidateQueries(['/miner/roundShare', { address }]),
      queryClient.invalidateQueries(['/miner/details', { address }]),
      queryClient.invalidateQueries('/miner/workers'),
      queryClient.invalidateQueries('/miner/rewards'),
      queryClient.invalidateQueries(['/miner/chart', { address }]),
      queryClient.invalidateQueries('/miner/stats'),
      queryClient.invalidateQueries([
        '/pool/averageBlockReward',
        { coin: coinTicker },
      ]),
      queryClient.invalidateQueries([
        '/pool/dailyRewardPerGigahashSec',
        { coin: coinTicker },
      ]),
      queryClient.invalidateQueries(['/pool/averageHashrate']),
      queryClient.invalidateQueries(['/pool/hashrate']),
      new Promise((resolve) => setTimeout(() => resolve(true), 1200)), // keep the loader animation to at least 1.2s
    ]);
  }, [queryClient, address, coinTicker]);

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

  // This forces local setting of active coin to be updated,
  // active coin ticker is then being used in various places within
  // the dashboard
  useEffect(() => {
    if (
      poolCoins &&
      poolCoins.coins.find((item) => item.ticker === coinTicker)
    ) {
      setCoinTicker(coinTicker);
    }
  }, [poolCoins, setCoinTicker, coinTicker]);

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
          {address === DONATION_ADDRESS && (
            <DonationAnnouncement
              id="donation-dashboard"
              variant="onBg"
              removable={false}
            >
              <Image
                width={100}
                height={66.66}
                src="/images/ukraine_flag.png"
                alt="Ukraine Flag"
              />
              <h3>This is the Ukraine donation dashboard</h3>
              <h3>Thank you for your support</h3>
            </DonationAnnouncement>
          )}

          <FlexFarmerAnnouncement />

          <Content>
            <HeaderGreetings
              coin={coinTicker}
              address={address}
              onRefresh={loadAll}
            />
            <TimeToLambo coin={coinTicker} address={address} />
            <Spacer />
            <AccountHeader
              coin={activeCoin}
              address={address}
              onRefresh={loadAll}
            />
            <Spacer />
            <MinerDetails coin={activeCoin} address={address} />
            <HeaderStats coin={coinTicker} address={address} />
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
                    counterTicker={counterTicker}
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
  counterTicker: string;
}>(
  () =>
    import('src/pages/MinerDashboard/Rewards/MinerRewards.page').then(
      (module) => module.default
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
        <Content style={{ marginTop: '1rem' }}>
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
