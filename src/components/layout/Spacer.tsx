import styled from 'styled-components';

export const Spacer = styled.div<{ size?: 'lg' | 'xl' | 'md' | 'sm' }>`
  height: 1rem;

  ${(p) => p.size === 'sm' && `height: 0.5rem;`};
  ${(p) => p.size === 'md' && `height: 1rem;`};
  ${(p) => p.size === 'lg' && `height: 2rem;`};
  ${(p) => p.size === 'xl' && `height: 3rem;`};
`;
