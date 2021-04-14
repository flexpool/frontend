import React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components/macro';

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const Spinner = styled.svg`
  animation: ${rotate} 1s linear infinite;

  & circle {
    stroke: var(--primary);
    stroke-linecap: round;
    animation: ${dash} 1.5s ease-in-out infinite;
  }
`;

const Container = styled.div<{ size?: 'xs' }>`
  width: 50px;
  height: 50px;

  ${(p) =>
    p.size === 'xs' &&
    `
      width: 14px;
      height: 14px;
  `}
`;

export const LoaderSpinner = React.forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div'] & { size?: 'xs' }
>((props, ref) => (
  <Container {...props} ref={ref}>
    <Spinner viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </Spinner>
  </Container>
));
