import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
0% {
  background-color: var(--bg-secondary);
}
50% {
  background-color: rgba(128, 128, 128, .2);
}
100 {
  background-color: var(--bg-secondary);
}
`;

export const Skeleton = styled.span<{ width?: number; sHeight?: number }>`
  background: var(--bg-secondary);
  width: 100px;
  height: 1rem;
  border-radius: 5px;
  animation: ${pulse} 2s linear infinite;
  margin-top: 3px;
  margin-bottom: 3px;
  display: inline-block;
  ${(p) => p.width && `width: ${p.width};`};
  ${(p) => p.sHeight && `height: ${p.sHeight} !important;`};
`;
