import styled from 'styled-components/macro';

export const Content = styled.div<{
  contentCenter?: boolean;
}>`
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  ${(p) =>
    p.contentCenter &&
    `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  `}
`;
