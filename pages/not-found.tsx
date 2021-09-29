import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled, { keyframes } from 'styled-components';
import { Page } from '../src/components/layout/Page';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';

import StarsSvg from '../src/pages/NotFound/assets/stars.svg';
import EarthSvg from '../src/pages/NotFound/assets/earth.svg';
import MoonSvg from '../src/pages/NotFound/assets/moon.svg';
import AstronautSvg from '../src/pages/NotFound/assets/astronaut.svg';

const Wrapper = styled.div`
  background-image: linear-gradient(80deg, #0e418a 0%, #2b2749 100%);

  background-image: linear-gradient(48deg, #1c3a65 0%, #27253a 100%);

  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  position: relative;
  min-height: 70vh;
  * {
    color: var(--text-on-bg);
  }

  h1 {
    margin-top: 5rem;
    font-size: 10rem;
    font-weight: 700;
  }
  h2 {
    font-weight: 600;
    text-transform: uppercase;
    opacity: 0.8;
    margin-top: 0rem;
    font-size: 1rem;
    letter-spacing: 0.2rem;
  }
`;

const StarsContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  svg {
    height: 100%;
  }
`;

const EarthContainer = styled.div`
  height: 5rem;
  width: 5rem;
  position: absolute;
  top: -0rem;
  left: -10rem;
`;
const MoonContainer = styled.div`
  height: 5rem;
  width: 5rem;
  position: absolute;
  top: -5rem;
  left: 0rem;
`;

const astroAnimation = keyframes`

  0% {
    transform: rotate(0deg);
  }


  100% {
    transform: rotate(1800deg);
  }
`;

const AstronautContainer = styled.div`
  position: absolute;
  height: 3rem;
  width: 3rem;
  top: 0;
  left: -10rem;
  /* background: red; */
  animation: ${astroAnimation} 700s linear infinite;
  padding-left: 100%;

  svg {
    animation: ${astroAnimation} 30s linear infinite;
    height: 3rem;
    width: 3rem;
  }
`;

const MiddleContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto;

  @media screen and (max-width: 600px) {
    transform: scale(0.6);
  }
`;

export const NotFoundPage = () => {
  const { t: seoT, i18n } = useTranslation('seo');

  return (
    <Page>
      <Wrapper>
        <NextSeo
          title={seoT('title.not-found')}
          description={seoT('website_description.not-found')}
          openGraph={{
            title: seoT('title.not-found'),
            description: seoT('website_description.not-found'),
            locale: i18n.language,
          }}
          noindex={true}
        />
        <StarsContainer>
          <StarsSvg />
        </StarsContainer>
        <MiddleContainer>
          <h1>404</h1>
          <EarthContainer>
            <EarthSvg />
          </EarthContainer>
          <MoonContainer>
            <MoonSvg />
          </MoonContainer>
          <AstronautContainer>
            <AstronautSvg />
          </AstronautContainer>
          <h2>Can&apos;t find the moon?</h2>
        </MiddleContainer>
      </Wrapper>
    </Page>
  );
};

export default NotFoundPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}
