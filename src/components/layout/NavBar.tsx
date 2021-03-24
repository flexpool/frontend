import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from 'src/assets/logo.svg';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import styled from 'styled-components/macro';

import { FaChartArea, FaCubes } from 'react-icons/fa';
import { useBoolState } from 'src/hooks/useBoolState';
import React from 'react';

const NLink = styled(NavLink)`
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  text-decoration: none;
  padding: 1rem;
  font-weight: 600;
  svg {
    height: 1.25rem;
    width: 1.25rem;
  }
  &.active {
    color: var(--primary);
  }
`;

const NavSection = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  &:not(:first-child) {
    margin-left: 2rem;
  }
  &:not(:last-child) {
    margin-right: 2rem;
  }
`;

const MobileSlide = styled(ScrollArea)<{ isOpen?: boolean }>`
  width: 100%;
  max-width: 400px;
  position: fixed;
  top: 70px;
  left: 100%;
  bottom: 0;
  background: var(--bg-primary);
  z-index: 1000;
  padding: 1rem;

  display: flex;
  flex-direction: column;

  a {
    height: 50px;
    padding: 0 1rem;
  }

  transition: 0.2s all;

  ${(p) =>
    p.isOpen &&
    `
    transform: translateX(-100%);
  `}
`;

const NavContainerOuter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1000;
  background: var(--bg-primary);
  display: flex;
  @media screen and (max-width: 768px) {
    display: none;
  }
  img {
    height: 30px;
  }
  border-bottom: 1px solid var(--border-color);
`;

export type NavBarType = {};

const NavContainer = styled(Content)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  align-items: center;
`;

const ContainerMobile = styled(NavContainerOuter)`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
  }

  img {
    height: 20px;
  }
`;

const FixedMargin = styled.div`
  height: 70px;
`;

export const NavBar: React.FC<NavBarType> = (props) => {
  const openState = useBoolState();

  const location = useLocation();

  React.useEffect(() => {
    openState.handleFalse();
  }, [location]);

  return (
    <>
      <FixedMargin />
      <NavContainerOuter>
        <NavContainer>
          <NavLink to="/">
            <img src={Logo} alt="Flexpool Logo" />
          </NavLink>
          <NavSection>
            <NLink to="/statistics">Statistics</NLink>
            <NLink to="/blocks">Blocks</NLink>
            <NLink to="/miners">Miners</NLink>
          </NavSection>
          <NavSection>
            <NLink to="/faq">FAQ</NLink>
            <NLink to="/support">Support</NLink>
            <Button variant="primary" as={Link} to="/get-started">
              Get Started
            </Button>
          </NavSection>
        </NavContainer>
      </NavContainerOuter>

      <ContainerMobile>
        <NavContainer>
          <NavLink to="/">
            <img src={Logo} alt="Flexpool Logo" />
          </NavLink>
          <NavSection>
            <NLink to="/statistics">
              <FaChartArea />
            </NLink>
            <NLink to="/blocks">
              <FaCubes />
            </NLink>
            <Button onClick={openState.handleToggle}> x </Button>
          </NavSection>
        </NavContainer>
        <MobileSlide isOpen={openState.value}>
          <Button variant="primary">Get Started</Button>
          <NLink to="/statistics">Statistics</NLink>
          <NLink to="/blocks">Blocks</NLink>
          <NLink to="/miners">Miners</NLink>
          <NLink to="/faq">FAQ</NLink>
          <NLink to="/support">Support</NLink>
        </MobileSlide>
      </ContainerMobile>
    </>
  );
};
