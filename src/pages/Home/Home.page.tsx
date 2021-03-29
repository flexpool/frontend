import { Content } from 'src/components/layout/Content';
import { HeroBlue } from 'src/components/layout/Hero/HeroBlue';
import { Page } from 'src/components/layout/Page';
import { CoinsWeMineSection } from 'src/pages/Home/CoinsWeMine.section';
import { GetStartedSection } from 'src/sections/GetStarted.section';
import { NewsSection } from './News.section';
import styled from 'styled-components/macro';
import { SearchAddressBar } from 'src/components/SearchAddressBar/SearchAddressBar';
import { CoinNews } from 'src/sections/CoinNews';
import Modal from 'src/components/Modal/Modal';

const Hero = styled(HeroBlue)`
  min-height: 40vh;
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const SearchWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin-top: 2rem;
`;

export const HomePage = () => {
  return (
    <Page>
      <Modal size="lg" isOpen={true} handleClose={() => {}}>
        <Modal.Body>
          <h2>Featured stories</h2>
          <CoinNews coinTicker="eth" />
        </Modal.Body>
      </Modal>
      <Hero>
        <Content contentCenter>
          <h1>Mining pool that enables innovation</h1>
          <p>Better mining pool for modern cryptocurrency miners.</p>
          <SearchWrapper>
            <SearchAddressBar />
          </SearchWrapper>
        </Content>
      </Hero>
      <NewsSection />
      <CoinsWeMineSection />
      <GetStartedSection />
    </Page>
  );
};
