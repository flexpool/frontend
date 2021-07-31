import styled from 'styled-components';

export const Spacer = styled.div<{ size?: 'lg' | 'xl' }>`
  height: 1rem;

  ${(p) => p.size === 'lg' && `height: 2rem;`};
  ${(p) => p.size === 'xl' && `height: 3rem;`};
`;
