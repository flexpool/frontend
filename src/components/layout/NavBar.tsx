import cls from './NavBar.module.scss';
import { NavLink } from 'react-router-dom';
import Logo from 'src/assets/logo.svg';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import styled from 'styled-components/macro';

import { FaChartArea, FaCubes } from 'react-icons/fa';
import { useBoolState } from 'src/hooks/useBoolState';

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
  width: 100vw;
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
  /* position: sticky; */
  top: 0;
  left: 0;
  width: 100vw;
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

export const NavBar: React.FC<NavBarType> = (props) => {
  const openState = useBoolState();
  return (
    <>
      <NavContainerOuter>
        <NavContainer>
          <NavLink to="/">
            <img className={cls.logo} src={Logo} alt="Flexpool Logo" />
          </NavLink>
          <NavSection>
            <NLink to="/statistics">Statistics</NLink>
            <NLink to="/statistics">Blocks</NLink>
            <NLink to="/statistics">Miners</NLink>
          </NavSection>
          <NavSection>
            <NLink to="/statistics">FAQ</NLink>
            <NLink to="/statistics">Support</NLink>
            <Button variant="primary">Get Started</Button>
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
            <NLink to="/statistics">
              <FaCubes />
            </NLink>
            <Button onClick={openState.handleToggle}> x </Button>
          </NavSection>
        </NavContainer>
        <MobileSlide isOpen={openState.value}>
          <Button variant="primary">Get Started</Button>
          <NLink to="/statistics">Statistics</NLink>
          <NLink to="/statistics">Blocks</NLink>
          <NLink to="/statistics">Miners</NLink>
          <NLink to="/statistics">FAQ</NLink>
          <NLink to="/statistics">Support</NLink>
        </MobileSlide>
      </ContainerMobile>
    </>
  );
};
