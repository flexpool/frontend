import styled from 'styled-components/macro';

export const Content = styled.div<{
  contentCenter?: boolean;
  padding?: boolean;
  paddingLg?: boolean;
  md?: boolean;
}>`
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  padding-left: 1rem;
  padding-right: 1rem;
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
    padding-top: 1rem;
    padding-bottom: 1rem;
  `};
  ${(p) =>
    p.paddingLg &&
    `
    padding-top: 4rem;
    padding-bottom: 4rem;
  `};
  ${(p) =>
    p.md &&
    `
    max-width: 800px
  `};
`;
