import React from 'react';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../src/components/layout/Content';
import { CoinsWeMineSection } from '../src/pages/Home/components/CoinsWeMine/CoinsWeMine.section';
import { GetStartedSection } from '../src/pages/Home/components/GetStarted/GetStarted.section';
import { NewsSection } from '../src/pages/Home/components/News/News.section';
import { SearchAddressBar } from '../src/components/SearchAddressBar/SearchAddressBar';
import { Spacer } from '../src/components/layout/Spacer';
import { CoinEarnings } from '../src/pages/Home/components/CoinEarnings/CoinEarnings';
import { WhyFlexpool } from '../src/pages/Home/components/WhyFlexpool/WhyFlexpool';
import {
  Hero,
  SearchWrapper,
  PageContainer,
} from '../src/pages/Home/components';

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

      <Hero>
        <Content contentCenter style={{ position: 'relative', zIndex: 100 }}>
          <h1>{t('title')}</h1>
          <p>{t('description')}</p>
          <SearchWrapper>
            <SearchAddressBar />
          </SearchWrapper>
        </Content>
        <Spacer />
        <CoinEarnings />
        <Spacer />
        <NewsSection />
      </Hero>

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
      ])),
    },
  };
}
