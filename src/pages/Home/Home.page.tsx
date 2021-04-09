import { Content } from 'src/components/layout/Content';
import { HeroBlue } from 'src/components/layout/Hero/HeroBlue';
import { Page } from 'src/components/layout/Page';
import { CoinsWeMineSection } from 'src/pages/Home/CoinsWeMine.section';
import { GetStartedSection } from 'src/sections/GetStarted.section';
import { NewsSection } from './News.section';
import styled from 'styled-components/macro';
import { SearchAddressBar } from 'src/components/SearchAddressBar/SearchAddressBar';
import { Helmet } from 'react-helmet-async';
import { Spacer } from 'src/components/layout/Spacer';
import { CoinEarnings } from './CoinEarnings';
import { WhyFlexpool } from './WhyFlexpool';
import React from 'react';
import { useDispatch } from 'react-redux';
import { poolCoinsFullGet } from 'src/rdx/poolCoinsFull/poolCoinsFull.actions';

const Hero = styled(HeroBlue)`
  min-height: 40vh;
  padding-top: 10rem;
  padding-bottom: 10rem;
  margin-bottom: 4rem;
  position: relative;
  @media screen and (max-width: 800px) {
    margin-bottom: 0;
    padding-bottom: 3rem;
  }
`;

const SearchWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin-top: 2rem;
`;

const PageContainer = styled(Page)`
  background: var(--bg-secondary);
`;

export const HomePage = () => {
  const d = useDispatch();
  React.useEffect(() => {
    d(poolCoinsFullGet());
  }, [d]);

  return (
    <PageContainer>
      <Helmet>
        <title>The Most Advanced Mining Pool</title>
      </Helmet>
      <Hero>
        <Content contentCenter style={{ position: 'relative', zIndex: 100 }}>
          <h1>Building the Future of Mining Pools</h1>
          <p>
            Innovative mining pool created for modern cryptocurrency mining.
          </p>
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
