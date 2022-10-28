import React from 'react';
import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../src/components/layout/Content';
import { Page } from '../../src/components/layout/Page';
import { MineableCoinList } from '../../src/pages/GetStarted/CoinList.page';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CoinTabs, Tab } from '@/pages/GetStarted/CoinOptions/Coin';
import { CoinPillButton } from '@/pages/GetStarted/CoinOptions/CoinPillButton';
import { MiningGuideSection } from '@/pages/GetStarted/CoinOptions/MiningGuideSection';
import { mineableCoins } from '@/pages/GetStarted/mineableCoinList';
import { Spacer } from '@/components/layout/Spacer';

const Header = styled.div`
  border-bottom: 1px solid var(--border-color);
  padding: 22px 0;
  z-index: 1;
`;

const TabsContainer = styled.div`
  overflow: scroll;
  z-index: 100;
  position: sticky;
  top: 71px;
  padding: 22px 0;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  overflow-y: hidden;
  height: 86px;

  @media (max-width: 768px) {
    top: 70px;
  }

  -webkit-transform: translate3d(0, 0, 0);
`;

const GuideContent = styled(Content)`
  -webkit-transform: translate3d(0, 0, -1px);
`;

export const GetStartedPage = () => {
  const { t: seoT, i18n } = useTranslation('seo');
  const { t } = useTranslation('get-started');

  return (
    <Page>
      <NextSeo
        title={seoT('title.get_started_home')}
        description={seoT('website_description.get_started_home')}
        openGraph={{
          title: seoT('title.get_started_home'),
          description: seoT('website_description.get_started_home'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.get_started_home'),
          },
        ]}
      />
      <Header>
        <Content>
          <h1>{t('list.title')}</h1>
        </Content>
      </Header>

      <CoinTabs>
        <TabsContainer>
          <Content>
            <CoinTabs.TabList>
              {mineableCoins.map((coin, index) => {
                return (
                  <Tab key={coin.ticker} index={index}>
                    {({ selected }) => (
                      <CoinPillButton
                        selected={selected}
                        coin={{
                          name: coin.name,
                          ticker: coin.ticker,
                        }}
                      ></CoinPillButton>
                    )}
                  </Tab>
                );
              })}
            </CoinTabs.TabList>
          </Content>
        </TabsContainer>

        <GuideContent>
          <Spacer size="xl" />

          {mineableCoins.map((coin, index) => {
            return (
              <CoinTabs.Section key={coin.ticker} index={index}>
                <MiningGuideSection
                  coin={coin}
                  ticker={coin.ticker as string}
                  name={coin.name}
                />
              </CoinTabs.Section>
            );
          })}
        </GuideContent>
      </CoinTabs>
    </Page>
  );
};

export default GetStartedPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'get-started',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}
