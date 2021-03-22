import cls from './NavBar.module.scss';
import { NavLink } from 'react-router-dom';
import Logo from 'src/assets/logo.svg';
import { Content } from 'src/components/layout/Content';
import { crc } from 'src/componentUtils/createSimpleComponent';
import { Button } from 'src/components/Button';
import styled from 'styled-components/macro';

const NLink = crc(NavLink, cls.navLink);

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

export type NavBarType = {};

export const NavBar: React.FC<NavBarType> = (props) => {
  return (
    <header>
      <Content className={cls.headerInner}>
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
      </Content>
    </header>
  );
};
