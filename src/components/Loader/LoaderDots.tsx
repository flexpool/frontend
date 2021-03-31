import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

export type LoaderDotsProps = JSX.IntrinsicElements['span'];

const DotsAnimation = keyframes`
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

const Dot = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10}>
    <g fill="currentColor">
      <circle r="5" cx="50%" cy="50%" />
    </g>
  </svg>
);
const LoaderDotContainer = styled.div`
  display: flex;
  svg {
    margin: 0 2px;
    animation: ${DotsAnimation} 1s infinite ease-in-out both;
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    &:nth-child(3) {
      animation-delay: -0.32s;
    }
  }
`;

export const LoaderDots = React.forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div']
>((props, ref) => {
  return (
    <>
      <LoaderDotContainer {...props} ref={ref}>
        <Dot />
        <Dot />
        <Dot />
      </LoaderDotContainer>
    </>
  );
});

export default LoaderDots;
