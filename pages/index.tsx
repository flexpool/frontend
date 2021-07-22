import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

import { poolCoinsFullGet } from '../src/rdx/poolCoinsFull/poolCoinsFull.actions';

export const HomePage = () => {
  const d = useDispatch();

  React.useEffect(() => {
    d(poolCoinsFullGet());
  }, [d]);

  const { t } = useTranslation('home');

  return (
    <PageContainer>
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
