import { Content } from 'src/components/layout/Content';
import { HeroBlue } from 'src/components/layout/Hero/HeroBlue';
import { Page } from 'src/components/layout/Page';
import { CoinsWeMineSection } from 'src/pages/Home/CoinsWeMine.section';
import { GetStartedSection } from 'src/sections/GetStarted.section';
import { NewsSection } from './News.section';
import styled from 'styled-components/macro';

const Hero = styled(HeroBlue)`
  min-height: 50vh;
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

export const HomePage = () => {
  return (
    <Page>
      <Hero>
        <Content contentCenter>
          <h1>Mining pool that enables innovation</h1>
          <p>Better mining pool for modern cryptocurrency miners.</p>
        </Content>
      </Hero>
      <NewsSection />
      <CoinsWeMineSection />
      <GetStartedSection />
    </Page>
  );
};
