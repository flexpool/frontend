import React from 'react';
import { Content } from 'src/components/layout/Content';
import { CoinsWeMineSection } from 'src/sections/CoinsWeMine.section';
import { GetStartedSection } from 'src/sections/GetStarted.section';
import { Hero } from './Home.components';

export const HomePage = () => {
  return (
    <>
      <Hero>
        <Content contentCenter>
          <h1>Mining pool that enables innovation</h1>
          <p>Better mining pool for modern cryptocurrency miners.</p>
        </Content>
      </Hero>
      <CoinsWeMineSection />
      <GetStartedSection />
    </>
  );
};
