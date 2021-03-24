import styled, { keyframes } from 'styled-components/macro';

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

export const Skeleton = styled.div`
  background: var(--bg-secondary);
  width: 100px;
  height: 1rem;
  border-radius: 4px;
  animation: ${pulse} 2s linear infinite;
  margin-top: 3px;
  margin-bottom: 3px;
  display: inline-block;
`;
