import React from 'react';
import { Img } from 'src/components/Img';
import SnowFall from 'react-snowfall';
import styled from 'styled-components';

const Hero = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  background: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 3rem;
    color: var(--text-on-bg);
  }
  p {
    color: var(--text-on-bg);
  }

  position: relative;
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const WorldMap = styled(Img)`
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 0;
  opacity: 0.2;
`;

export const HeroBlue: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <Hero className={className}>
      {children}
      <SnowFall style={{ zIndex: 0 }} />
      <WorldMap src="/illustrations/world_map_dots.svg" alt="World map" />
    </Hero>
  );
};
