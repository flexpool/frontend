import React from 'react';
import Link from 'next/link';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import styled from 'styled-components';

import { FaChartArea, FaCubes, FaSearch } from 'react-icons/fa';
import { NavContainerOuter } from './components';
import { useBoolState } from 'src/hooks/useBoolState';
import { useOpenState } from 'src/hooks/useOpenState';
import Modal from '@/components/Modal/Modal';
import { SearchAddressCachedResult } from '@/components/SearchAddressBar/SearchAddressCachedResult';
import { SearchAddressBar } from '@/components/SearchAddressBar/SearchAddressBar';
import { Burger } from '@/components/Burger/Burger';
import { clx } from 'src/utils/clx';

import { useTranslation } from 'next-i18next';
import MobileDrawer from './MobileDrawer';

import { useAppTheme } from '@/rdx/localSettings/localSettings.hooks';

const Logo = styled.div`
  width: 165px;
`;

const LogoMobile = styled.div`
  width: 141px;
`;

const NLink = styled.a`
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

const NavSection = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  &:not(:first-child) {
    margin-left: 0.5rem;
  }
  &:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

const NavSectionSearch = styled(NavSection)`
  flex-grow: 1;
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

const NavBar: React.FC<NavBarType> = (props) => {
  const openState = useBoolState();
  const modalSearchOpenState = useOpenState();
  const { t } = useTranslation(['home', 'common']);
  const appTheme = useAppTheme();

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
          <SearchAddressBar
            showResult={false}
            callback={modalSearchOpenState.handleClose}
          />
        </Modal.Body>
        <ScrollArea>
          <SearchAddressCachedResult
            callback={modalSearchOpenState.handleClose}
          />
        </ScrollArea>
      </Modal>
      <FixedMargin />
      <NavContainerOuter>
        <NavContainer>
          <NavSection>
            <Link href="/" passHref>
              <NLink style={{ marginLeft: '-0.5rem' }}>
                <Logo className="logo-img" />
              </NLink>
            </Link>
            <Link href="/statistics" passHref>
              <NLink>{t('common:nav.statistics')}</NLink>
            </Link>
            <Link href="/blocks" passHref>
              <NLink>{t('common:nav.blocks')}</NLink>
            </Link>
            <Link href="/miners" passHref>
              <NLink>{t('common:nav.miners')}</NLink>
            </Link>
          </NavSection>
          <NavSectionSearch>
            <SearchContainer>
              <SearchAddressBar />
            </SearchContainer>
          </NavSectionSearch>
          <NavSection>
            <Link href="/faq" passHref>
              <NLink>{t('common:nav.faq')}</NLink>
            </Link>
            <Link href="/support" passHref>
              <NLink>{t('common:nav.support')}</NLink>
            </Link>
            <Link href="/get-started" passHref>
              <Button style={{ marginLeft: 10 }} variant="primary">
                {t('common:nav.get_started')}
              </Button>
            </Link>
          </NavSection>
        </NavContainer>
      </NavContainerOuter>

      <ContainerMobile>
        <NavContainer>
          <Link href="/" aria-label="Home page">
            <LogoMobile className="logo-img" />
          </Link>
          <NavSection>
            <Link href="/statistics" passHref>
              <NLink aria-label="Statistics">
                <FaChartArea className="nav-svg" />
              </NLink>
            </Link>
            <Link href="/blocks" passHref>
              <NLink aria-label="Blocks">
                <FaCubes className="nav-svg" />
              </NLink>
            </Link>
            <NLink
              as="button"
              aria-label="Search Address"
              onClick={modalSearchOpenState.handleOpen}
            >
              <FaSearch className="nav-svg" />
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

        <MobileDrawer
          isOpen={openState.value}
          onClose={openState.handleFalse}
        />
        {/* {openState.value && (
          <Helmet bodyAttributes={{ class: 'scroll-lock' }} />
        )} */}
      </ContainerMobile>
    </>
  );
};

export default NavBar;
