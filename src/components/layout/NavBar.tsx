import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import styled from 'styled-components';

import {
  FaChartArea,
  FaCubes,
  FaDiscord,
  FaReddit,
  FaSearch,
  FaTelegram,
} from 'react-icons/fa';
import { useBoolState } from 'src/hooks/useBoolState';
import { useOpenState } from 'src/hooks/useOpenState';
import Modal from '../Modal/Modal';
import { SearchAddressCachedResult } from '../SearchAddressBar/SearchAddressCachedResult';
import { SearchAddressBar } from '../SearchAddressBar/SearchAddressBar';
import { Ws } from '../Typo/Typo';
import { Burger } from '../Burger/Burger';
import { clx } from 'src/utils/clx';

import { SelectTheme, NewSelectTheme } from '../SelectTheme';
import { Spacer } from './Spacer';
import {
  SelectCounterTicker,
  NewSelectCounterTicker,
} from '../SelectCounterTicker';
import { LinkOut } from '../LinkOut';
import { DISCORD_LINK, REDDIT_LINK, TELEGRAM_LINK } from 'src/constants';
import { useAppTheme } from 'src/rdx/localSettings/localSettings.hooks';
import { Img } from '../Img';
import { useTranslation } from 'next-i18next';
import { NewSelectLanguage, SelectLanguage } from '../SelectLanguage';

const LogoSvg = require('../../../public/svg/logo.svg') as string;

const Logo = styled(LogoSvg)`
  height: 29px;
  width: 165px;
  fill: var(--text-primary);
`;

const LogoMobile = styled(LogoSvg)`
  height: 25px;
  width: 141px;
  fill: var(--text-primary);
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

const MobileNavLink = styled.a`
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
  const { t } = useTranslation(['home', 'common']);
  const router = useRouter();

  React.useEffect(() => {
    openState.handleFalse();
    modalSearchOpenState.handleClose();
    // eslint-disable-next-line
  }, [
    router.pathname,
    openState.handleFalse,
    modalSearchOpenState.handleClose,
  ]);

  const colorMode = useAppTheme();

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
            <Link href="/" passHref>
              <NLink style={{ marginLeft: '-0.5rem' }}>
                <Logo />
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
            <a>
              <LogoMobile />
            </a>
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

        {/* {openState.value && (
          <Helmet bodyAttributes={{ class: 'scroll-lock' }} />
        )} */}
        <MobileSlide isOpen={openState.value}>
          <SlideHideRest
            isOpen={openState.value}
            onClick={openState.handleFalse}
          />
          <ScrollArea>
            <Link href="/statistics" passHref>
              <MobileNavLink href="/statistics">
                {t('common:nav.statistics')}
              </MobileNavLink>
            </Link>
            <Link href="/blocks" passHref>
              <MobileNavLink href="/blocks">
                {t('common:nav.blocks')}
              </MobileNavLink>
            </Link>
            <Link href="/miners" passHref>
              <MobileNavLink href="/miners">
                {t('common:nav.miners')}
              </MobileNavLink>
            </Link>
            <Link href="/faq" passHref>
              <MobileNavLink href="/faq">{t('common:nav.faq')}</MobileNavLink>
            </Link>
            <Link href="/support" passHref>
              <MobileNavLink href="/support">
                {t('common:nav.support')}
              </MobileNavLink>
            </Link>
            <MobileNavTitle>{t('common:nav.community_title')}</MobileNavTitle>
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
            <Link href="/get-started" passHref>
              <Button shape="block" variant="primary">
                <Ws>{t('common:nav.get_started')}</Ws>
              </Button>
            </Link>
            <Spacer />
            {/* <SelectCounterTicker /> */}
            <NewSelectCounterTicker />
            <Spacer />
            {/* <SelectTheme /> */}
            <NewSelectTheme />
            <Spacer />
            {/* <SelectLanguage /> */}
            <NewSelectLanguage />
          </div>
        </MobileSlide>
      </ContainerMobile>
    </>
  );
};
