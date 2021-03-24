import styled from 'styled-components/macro';

export const Divider = styled.div<{ margin?: boolean }>`
  width: 100%;
  height: 1px;
  background: var(--border-color);
  ${(p) =>
    p.margin &&
    `
    margin-top: 3rem;
    margin-bottom: 3rem;
  `}
`;
