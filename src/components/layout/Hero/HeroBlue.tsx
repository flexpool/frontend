import React, { useEffect, useRef } from 'react';
import { Img } from 'src/components/Img';
import SnowFall from 'react-snowfall';
import styled, { keyframes } from 'styled-components';
import createGlobe from 'cobe';

const Hero = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  /* background: var(--primary); */
  background: #151519
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 0;

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

const aurora = keyframes`
    0% {
        background-position: left top;
    }
    25% {
        background-position: right top;
    }
    50% {
        background-position: right bottom;
    }
    75% {
        background-position: left bottom;
    }
    100% {
        background-position: left top;
    }
`;

const StyledAurora = styled.div`
  background: linear-gradient(300deg, #32a6ff 0%, #3f6fff 49%, #8d54ff 82%);
  background-size: 200%;
  animation: ${aurora} 10s infinite;
`;

const RadicalAurora = styled.div`
  background: radial-gradient(
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.15)
  );
  background-size: 200%;
  animation: ${aurora} 7s infinite;
`;

const Blob = styled.div`
  width: 1000px;
  height: 1000px;
  filter: blur(50rem);
  position: absolute;
  top: -70%;
  left: -60%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;utf8, %3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' %3E %3Cdefs%3E %3Cfilter id='grain' x='-50vw' y='-50vh' width='100vw' height='100vh'%3E %3CfeFlood flood-color='%23ffffff' result='neutral-gray' /%3E %3CfeTurbulence in='neutral-gray' type='fractalNoise' baseFrequency='2.5' numOctaves='100' stitchTiles='stitch' result='noise' /%3E %3CfeColorMatrix in='noise' type='saturate' values='0' result='destaturatedNoise' %3E%3C/feColorMatrix%3E %3CfeComponentTransfer in='desaturatedNoise' result='theNoise'%3E %3CfeFuncA type='table' tableValues='0 0 0.2 0'%3E%3C/feFuncA%3E %3C/feComponentTransfer%3E %3CfeBlend in='SourceGraphic' in2='theNoise' mode='soft-light' result='noisy-image' /%3E %3C/filter%3E %3CclipPath id='shape'%3E %3Cpath fill='currentColor' d='M829.5,674Q701,848,482,879Q263,910,180.5,705Q98,500,177.5,290Q257,80,484,107.5Q711,135,834.5,317.5Q958,500,829.5,674Z'%3E%3C/path%3E %3C/clipPath%3E %3C/defs%3E %3Cg filter='url(%23grain)' clip-path='url(%23shape)'%3E %3Cpath fill='%23905ba5' d='M829.5,674Q701,848,482,879Q263,910,180.5,705Q98,500,177.5,290Q257,80,484,107.5Q711,135,834.5,317.5Q958,500,829.5,674Z' /%3E %3C/g%3E %3C/svg%3E");
`;

const GlobeBackground = styled.div`
  width: 800px;
  height: 800px;
  filter: blur(50rem);
  position: absolute;
  top: -8%;
  right: -22%;
  z-index: -1001;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;utf8, %3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' %3E %3Cdefs%3E %3Cfilter id='grain' x='-50vw' y='-50vh' width='100vw' height='100vh'%3E %3CfeFlood flood-color='%23ffffff' result='neutral-gray' /%3E %3CfeTurbulence in='neutral-gray' type='fractalNoise' baseFrequency='2.5' numOctaves='100' stitchTiles='stitch' result='noise' /%3E %3CfeColorMatrix in='noise' type='saturate' values='0' result='destaturatedNoise' %3E%3C/feColorMatrix%3E %3CfeComponentTransfer in='desaturatedNoise' result='theNoise'%3E %3CfeFuncA type='table' tableValues='0 0 0.2 0'%3E%3C/feFuncA%3E %3C/feComponentTransfer%3E %3CfeBlend in='SourceGraphic' in2='theNoise' mode='soft-light' result='noisy-image' /%3E %3C/filter%3E %3CclipPath id='shape'%3E %3Cpath fill='currentColor' d='M829.5,674Q701,848,482,879Q263,910,180.5,705Q98,500,177.5,290Q257,80,484,107.5Q711,135,834.5,317.5Q958,500,829.5,674Z'%3E%3C/path%3E %3C/clipPath%3E %3C/defs%3E %3Cg filter='url(%23grain)' clip-path='url(%23shape)'%3E %3Cpath fill='%23905ba5' d='M829.5,674Q701,848,482,879Q263,910,180.5,705Q98,500,177.5,290Q257,80,484,107.5Q711,135,834.5,317.5Q958,500,829.5,674Z' /%3E %3C/g%3E %3C/svg%3E");
`;

const Aurora = ({ children }: any) => {
  return (
    // <StyledAurora>
    <>{children}</>
    // </StyledAurora>
  );
};

const GlobalCanvas = styled.canvas`
  width: 1100px;
  height: 1100px;
  position: absolute;
  top: -8%;
  right: -22%;
  z-index: -1000;
  /* background-color: red; */
  /* background: radial-gradient(
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.15)
  ); */
`;

export const HeroBlue: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1100 * 2,
      height: 1100 * 2,
      phi: -100,
      theta: 0.35,
      dark: 1,
      diffuse: 0,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.29, 0.2, 0.51],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [47.6062, 122.3321], size: 0.05 },
        { location: [49.2827, 123.1207], size: 0.05 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.002;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <Aurora>
      <Hero className={className}>
        <Blob />
        {children}
        <GlobeBackground />
        <GlobalCanvas ref={canvasRef} />

        {/* <SnowFall style={{ zIndex: 0 }} /> */}
        {/* <WorldMap src="/illustrations/world_map_dots.svg" alt="World map" /> */}
      </Hero>
    </Aurora>
  );
};
