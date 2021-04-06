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

const Hero = styled(HeroBlue)`
  min-height: 40vh;
  padding-top: 5rem;
  padding-bottom: 5rem;
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

export const HomePage = () => {
  return (
    <Page>
      <Helmet>
        <title>The Largest North American Ethereum Pool</title>
      </Helmet>
      <Hero>
        <Content contentCenter style={{ position: 'relative', zIndex: 100 }}>
          <h1>Mining pool that enables innovation</h1>
          <p>Better mining pool for modern cryptocurrency miners.</p>
          <SearchWrapper>
            <SearchAddressBar />
          </SearchWrapper>
        </Content>
        <Spacer />
        <NewsSection />
      </Hero>
      <CoinsWeMineSection />
      <GetStartedSection />
    </Page>
  );
};
