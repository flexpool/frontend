import React from 'react';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import Image from 'next/image';
import { Content } from '../src/components/layout/Content';
import { CoinsWeMineSection } from '../src/pages/Home/components/CoinsWeMine/CoinsWeMine.section';
import { GetStartedSection } from '../src/pages/Home/components/GetStarted/GetStarted.section';
import { NewsSection } from '../src/pages/Home/components/News/News.section';
import { SearchAddressBar } from '../src/components/SearchAddressBar/SearchAddressBar';
import { Spacer } from '../src/components/layout/Spacer';
import { CoinEarnings } from '../src/pages/Home/components/CoinEarnings/CoinEarnings';
import { WhyFlexpool } from '../src/pages/Home/components/WhyFlexpool/WhyFlexpool';
import { SearchWrapper, PageContainer } from '../src/pages/Home/components';
import HeroHeadline from '@/pages/Home/components/HeroHeadline';
import Globe from '@/components/Globe';
import LamboExplainer from '@/pages/Home/components/LamboExplainer';

import SnowFall from 'react-snowfall';
import { ShowBetweenDates } from '@/components/ShowBetweenDates';
import AnnouncementBar from '@/components/AnnouncementBar';
import { LinkOut } from '@/components/LinkOut';

const CURRENT_YEAR = new Date().getFullYear();

const HeroGlow1 = styled.div`
  display: none;
  position: absolute;
  right: -400px;
  bottom: 130px;
  z-index: -100;
  width: 800px;
  height: 800px;

  @media screen and (min-width: 800px) {
    display: block;
  }
`;

const HeroGlow2 = styled.div`
  position: absolute;
  left: -400px;
  top: -400px;
  z-index: -100;
  width: 800px;
  height: 800px;
`;

const Hero = styled.div`
  min-height: 40vh;
  position: relative;
  z-index: 100;
  background-color: #151519;
  overflow: hidden;
  padding-bottom: 3rem;

  @media screen and (min-width: 800px) {
    padding-bottom: 8rem;
  }
`;

const HeroLayout = styled.div`
  display: flex;
  position: relative;
`;

const HeroLeft = styled.div`
  flex-basis: 100%;
  flex-shrink: 0;
  z-index: 200;
  padding: 4rem 0 0;

  @media screen and (min-width: 800px) {
    flex-basis: 55%;
    padding: 6.5rem 0 0;
  }
`;

const HeroSubHeadline = styled.div`
  font-size: 1.1rem;
  font-weight: 400;
  color: #ccc;
  line-height: 1.4;
  max-width: 80%;

  @media screen and (min-width: 800px) {
    font-size: 1.5rem;
    max-width: 80%;
  }
`;

export const HomePage = () => {
  const { t, i18n } = useTranslation('home');
  const { t: seoT } = useTranslation('seo');

  return (
    <PageContainer>
      <NextSeo
        title={seoT('title.home')}
        description={seoT('website_description.home')}
        openGraph={{
          title: seoT('title.home'),
          description: seoT('website_description.home'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.home'),
          },
        ]}
      />

      <AnnouncementBar id="iron-testnet-announcement" variant="primary">
        <b>Iron Fish Testnet Pool Mega Airdrop Announcement</b>

        <Spacer size="sm" />

        <div
          style={{
            width: '90%',
            margin: '0 auto',
            lineHeight: 1.4,
          }}
        >
          Earn a portion of our $5,000 airdrop for testing our testnet Iron Fish
          pool during the next three days.
          <br />
          <br />
          Details are in the{' '}
          <LinkOut
            href="https://www.reddit.com/r/Flexpool/comments/12pidk7/earn_a_portion_of_our_5000_airdrop_while_testing/"
            style={{
              color: 'white',
              textDecoration: 'underline',
            }}
          >
            announcement
          </LinkOut>
          .
        </div>
      </AnnouncementBar>
      <div
        style={{
          position: 'relative',
        }}
      >
        <Hero>
          <ShowBetweenDates
            start={`${CURRENT_YEAR} 1/15`}
            end={`${CURRENT_YEAR} 12/15`}
            mode="outside"
          >
            <SnowFall style={{ zIndex: 0 }} />
          </ShowBetweenDates>

          <Content>
            <HeroLayout>
              <HeroLeft>
                <HeroHeadline />
                <Spacer size="lg" />
                <HeroSubHeadline>{t('description')}</HeroSubHeadline>
                <Spacer size="sm" />
                <SearchWrapper>
                  <SearchAddressBar />
                </SearchWrapper>
                <Spacer size="md" />
              </HeroLeft>
              <Globe />
            </HeroLayout>
          </Content>
          <CoinEarnings />
          <LamboExplainer />

          <HeroGlow1>
            <Image width={800} height={800} src="/glow3.png" alt="glow" />
          </HeroGlow1>
          <HeroGlow2>
            <Image width={800} height={800} src="/glow4.png" alt="glow" />
          </HeroGlow2>
        </Hero>
        <NewsSection />
      </div>

      <CoinsWeMineSection />
      <WhyFlexpool />
      <GetStartedSection />
    </PageContainer>
  );
};

export default HomePage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'home',
        'cookie-consent',
        'seo',
        'dashboard',
      ])),
    },
  };
}
