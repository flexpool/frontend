import { Link, NavLink, useLocation } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import styled from 'styled-components/macro';

import {
  FaChartArea,
  FaCubes,
  FaDiscord,
  FaReddit,
  FaSearch,
  FaTelegram,
} from 'react-icons/fa';
import { useBoolState } from 'src/hooks/useBoolState';
import React from 'react';
import { useOpenState } from 'src/hooks/useOpenState';
import Modal from '../Modal/Modal';
import { SearchAddressCachedResult } from '../SearchAddressBar/SearchAddressCachedResult';
import { SearchAddressBar } from '../SearchAddressBar/SearchAddressBar';
import { Ws } from '../Typo/Typo';
import { Burger } from '../Burger/Burger';
import { clx } from 'src/utils/clx';

import { SelectTheme } from '../SelectTheme';
import { Spacer } from './Spacer';
import { Helmet } from 'react-helmet-async';
import { SelectCounterTicker } from '../SelectCounterTicker';
import { LinkOut } from '../LinkOut';
import { DISCORD_LINK, REDDIT_LINK, TELEGRAM_LINK } from 'src/constants';
import { useAppTheme } from 'src/rdx/localSettings/localSettings.hooks';
import { Img } from '../Img';
import { useTranslation } from 'react-i18next';
const Logo = styled(Img)`
  height: 29px;
  fill: var(--text-primary);
`;

const LogoMobile = styled(Img)`
  height: 25px;
  fill: var(--text-primary);
`;

const NLink = styled(NavLink)`
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
  svg {
    height: 1.4rem;
    width: 1.4rem;
  }
  &.active {
    color: var(--primary);
  }
  &:hover {
    text-decoration: none;
  }

  @media screen and (min-width: 1101px) {
    border-bottom: 2px solid transparent;
    margin: 0 2px;
    &:hover,
    &.active {
      border-color: var(--primary);
    }
  }
`;

const NavSection = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  &:not(:first-child) {
    margin-left: 1rem;
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const NavSectionSearch = styled(NavSection)`
  flex-grow: 1;
`;

const MobileSlide = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  max-width: 300px;
  position: fixed;
  top: 70px;
  left: 100%;
  bottom: 0;
  background: var(--bg-primary);
  z-index: 800;
  padding: 1rem;
  padding-bottom: 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition: 0.2s all;

  ${(p) =>
    p.isOpen &&
    `
    transform: translateX(-100%);
  `}
  box-shadow: 0 0 30px 0 rgba(0,0,0,0.1);
  ${NLink} {
    justify-content: flex-start;
    height: 50px;
    padding: 0 0rem;
  }
`;

const SlideHideRest = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 0;
  right: 100%;
  width: 200%;
  bottom: 0;
  background: var(--bg-primary);
  opacity: 0;
  visibility: hidden;
  ${(p) =>
    p.isOpen &&
    `
    opacity: .5;
    visibility: visible;
  `}
`;

const NavContainerOuter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 70px;
  z-index: 1000;
  background: var(--bg-primary);
  display: flex;
  @media screen and (max-width: 1100px) {
    display: none;
  }
  border-bottom: 1px solid var(--border-color);
`;

const BurgerWrap = styled(Button)`
  border: none;
  &:active,
  &.active {
    background: transparent;
  }
  background: none !important;
  outline: none !important;
  &:after {
    display: none !important;
  }
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
  @media screen and (max-width: 1100px) {
    display: flex;
  }

  img {
    height: 25px;
  }
`;

const FixedMargin = styled.div`
  height: 70px;
`;

const SearchContainer = styled.div`
  & > * {
    height: 46px;
  }
  flex-grow: 1;
`;

const MobileNavTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  padding-left: 1rem;
  text-transform: uppercase;
  margin-top: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const MobileNavLink = styled(Link)`
  padding: 0.5rem 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
  }
`;

export const NavBar: React.FC<NavBarType> = (props) => {
  const openState = useBoolState();
  const modalSearchOpenState = useOpenState();
  const { t } = useTranslation(['common']);

  const location = useLocation();

  React.useEffect(() => {
    openState.handleFalse();
    modalSearchOpenState.handleClose();
    // eslint-disable-next-line
  }, [location, openState.handleFalse, modalSearchOpenState.handleClose]);

  const colorMode = useAppTheme();
  const logoSrc =
    colorMode === 'light'
      ? 'https://static.flexpool.io/assets/brand/light.svg'
      : 'https://static.flexpool.io/assets/brand/dark.svg';

  return (
    <>
      <Modal
        size="sm"
        mobileFull
        closeOnOuterClick
        {...modalSearchOpenState.modalProps}
      >
        <Modal.Header>
          <h2>Search miner</h2>
        </Modal.Header>
        <Modal.Body>
          <SearchAddressBar showResult={false} />
        </Modal.Body>
        <ScrollArea>
          <SearchAddressCachedResult isOpen={modalSearchOpenState.isOpen} />
        </ScrollArea>
      </Modal>
      <FixedMargin />
      <NavContainerOuter>
        <NavContainer>
          <NavSection>
            <NavLink to="/">
              <Logo
                height="29px"
                width="165px"
                src={logoSrc}
                alt="Flexpool.io Logo"
              />
            </NavLink>
          </NavSection>
          <NavSection>
            <NLink to="/statistics">{t('nav.statistics')}</NLink>
            <NLink to="/blocks">{t('nav.blocks')}</NLink>
            <NLink to="/miners">{t('nav.miners')}</NLink>
          </NavSection>
          <NavSectionSearch>
            <SearchContainer>
              <SearchAddressBar />
            </SearchContainer>
          </NavSectionSearch>
          <NavSection>
            <NLink to="/faq">{t('nav.faq')}</NLink>
            <NLink to="/support">{t('nav.support')}</NLink>
            <Button
              style={{ marginLeft: 10 }}
              variant="primary"
              as={Link}
              to="/get-started"
            >
              <Ws>{t('nav.get_started')}</Ws>
            </Button>
          </NavSection>
        </NavContainer>
      </NavContainerOuter>

      <ContainerMobile>
        <NavContainer>
          <NavLink to="/" aria-label="Home page">
            <LogoMobile
              height="25px"
              width="141px"
              src={logoSrc}
              alt="Flexpool.io Logo"
            />
          </NavLink>
          <NavSection>
            <NLink aria-label="Statistics" to="/statistics">
              <FaChartArea />
            </NLink>
            <NLink to="/blocks" aria-label="Blocks">
              <FaCubes />
            </NLink>
            <NLink
              as="button"
              aria-label="Search Address"
              onClick={modalSearchOpenState.handleOpen}
            >
              <FaSearch />
            </NLink>
            <BurgerWrap
              aria-label="Open menu"
              className={clx({ active: openState.value })}
              onClick={openState.handleToggle}
            >
              <Burger isOpen={openState.value} />
            </BurgerWrap>
          </NavSection>
        </NavContainer>

        {openState.value && (
          <Helmet bodyAttributes={{ class: 'scroll-lock' }} />
        )}
        <MobileSlide isOpen={openState.value}>
          <SlideHideRest
            isOpen={openState.value}
            onClick={openState.handleFalse}
          />
          <ScrollArea>
            <MobileNavLink to="/statistics">Statistics</MobileNavLink>
            <MobileNavLink to="/blocks">Blocks</MobileNavLink>
            <MobileNavLink to="/miners">Miners</MobileNavLink>
            <MobileNavLink to="/faq">FAQ</MobileNavLink>
            <MobileNavLink to="/support">Support</MobileNavLink>
            <MobileNavTitle>Join the community</MobileNavTitle>
            <MobileNavLink as={LinkOut} href={DISCORD_LINK}>
              <FaDiscord /> Discord
            </MobileNavLink>
            <MobileNavLink as={LinkOut} href={REDDIT_LINK}>
              <FaReddit /> Reddit
            </MobileNavLink>
            <MobileNavLink as={LinkOut} href={TELEGRAM_LINK}>
              <FaTelegram /> Telegram
            </MobileNavLink>
          </ScrollArea>
          <div>
            <Button shape="block" as={Link} to="/get-started" variant="primary">
              <Ws>Get Started</Ws>
            </Button>
            <Spacer />
            <SelectCounterTicker />
            <Spacer />
            <SelectTheme />
          </div>
        </MobileSlide>
      </ContainerMobile>
    </>
  );
};
