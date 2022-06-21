import styled from 'styled-components';

export const NavContainerOuter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100vw - 9px);
  height: auto;
  z-index: 1000;
  background: var(--bg-primary);
  display: flex;
  flex-wrap: wrap;
  @media screen and (max-width: 1100px) {
    display: none;
  }
  border-bottom: 1px solid var(--border-color);
`;

export const NLink = styled.a`
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  text-decoration: none;
  padding: 0 0.75rem;
  align-items: center;
  font-weight: 600;
  border: none;
  outline: none;
  background: transparent;
  min-width: 50px;
  justify-content: center;
  svg.nav-svg {
    height: 1.4rem;
    width: 1.4rem;
  }

  &:hover {
    text-decoration: none;
  }

  @media screen and (min-width: 1101px) {
    border-bottom: 2px solid transparent;
    &:hover {
      background: rgba(128, 128, 128, 0.04);
      color: var(--primary);
    }
    &:active {
      background: rgba(128, 128, 128, 0.07);
    }
  }
  a {
  }
`;
