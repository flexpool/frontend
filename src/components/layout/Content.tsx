import styled from 'styled-components/macro';

export const Content = styled.div<{
  contentCenter?: boolean;
  padding?: boolean;
  paddingLg?: boolean;
}>`
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  padding-left: 2rem;
  padding-right: 2rem;
  ${(p) =>
    p.contentCenter &&
    `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  `}
  ${(p) =>
    p.padding &&
    `
    padding-top: 2rem;
    padding-bottom: 2rem;
  `};
  ${(p) =>
    p.paddingLg &&
    `
    padding-top: 4rem;
    padding-bottom: 4rem;
  `};
`;
