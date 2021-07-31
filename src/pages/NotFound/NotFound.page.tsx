// TODO: Remove this TS nocheck
// @ts-nocheck
import { Page } from 'src/components/layout/Page';

import styled from 'styled-components';

import { ReactComponent as StarsSvg } from './assets/stars.svg';
import EarthSrc from './assets/earth.svg';
import MoonSrc from './assets/moon.svg';
import AstronautSrc from './assets/astronaut.svg';
import { keyframes } from 'styled-components';
import { Img } from 'src/components/Img';

const Wrapper = styled(Page)`
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

const Earth = styled(Img)`
  height: 5rem;
  position: absolute;
  top: -0rem;
  left: -10rem;
`;
const Moon = styled(Img)`
  height: 5rem;
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

const Astronaut = styled(Img)`
  height: 3rem;
  animation: ${astroAnimation} 30s linear infinite;
`;

const AstronautContainer = styled.div`
  position: absolute;
  top: 0;
  left: -10rem;
  /* background: red; */
  animation: ${astroAnimation} 700s linear infinite;
  padding-left: 100%;
`;

const MiddleContainer = styled.div`
  position: relative;

  @media screen and (max-width: 600px) {
    transform: scale(0.6);
  }
`;

export const NotFoundPage = () => {
  return (
    <Wrapper>
      <StarsContainer>
        <StarsSvg />
      </StarsContainer>
      <MiddleContainer>
        <h1>404</h1>
        <Earth alt="Earth" src={EarthSrc} />
        <Moon alt="Moon" src={MoonSrc} />
        <AstronautContainer>
          <Astronaut alt="Astronaut" src={AstronautSrc} />
        </AstronautContainer>
        <h2>Can&apos;t find the moon?</h2>
      </MiddleContainer>
    </Wrapper>
  );
};

export default NotFoundPage;
