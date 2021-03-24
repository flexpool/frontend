import styled from 'styled-components/macro';
export const Card = styled.div<{ padding?: boolean }>`
  border-radius: 4px;
  border: 1px solid var(--border-color);
  ${(p) =>
    p.padding &&
    `
    padding: 1.5rem 2rem;
  `}
`;
