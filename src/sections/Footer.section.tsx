import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Content } from 'src/components/layout/Content';
import styled from 'styled-components';
import {
  FaDiscord,
  FaTelegram,
  FaReddit,
  FaTwitter,
  FaMedium,
  FaGithub,
} from 'react-icons/fa';
import { NewSelectCounterTicker } from 'src/components/SelectCounterTicker';
import { NewSelectTheme } from 'src/components/SelectTheme';
import { Spacer } from 'src/components/layout/Spacer';

import {
  DISCORD_LINK,
  GITHUB_LINK,
  MEDIUM_LINK,
  REDDIT_LINK,
  TELEGRAM_LINK,
  TELEGRAM_LINK_CN,
  TWITTER_LINK,
} from 'src/constants';

import { partnersData } from 'src/pages/Partners/partnersData';
import { LinkOut } from 'src/components/LinkOut';
import { Img } from 'src/components/Img';
import {
  SelectLanguage,
  NewSelectLanguage,
} from 'src/components/SelectLanguage';
import { useTranslation } from 'next-i18next';

const Footer = styled.footer`
  border-top: 6px solid var(--primary);
  background: #020e1f;
  padding-top: 5rem;
  padding-bottom: 5rem;

  color: var(--text-secondary);

  a {
    color: #77869e;
    display: block;
    padding: 0.6rem 0;
    &:hover {
      color: var(--text-on-bg);
      text-decoration: none;
    }
  }
`;

const FSectionTitle = styled.h3`
  color: var(--text-on-bg);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Section = styled.div`
  min-width: 200px;
  width: 1px;
  flex-grow: 1;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const FooterEnd = styled.div`
  border-top: 1px solid #404a59;
  margin-top: 2rem;
  padding-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;

  & > * {
    margin-top: 1.5rem;
  }
`;

const FooterLogo = styled(Img)`
  height: 30px;
  margin-right: 1rem;
`;

const FooterCompany = styled.div`
  display: flex;
  align-items: center;
`;

const SocialIcons = styled.div`
  display: flex;
  flex-wrap: wrap;
  svg {
    height: 30px;
    width: 30px;
  }

  & > * {
    margin-left: 1rem;
  }
`;

const HelpText = styled.p`
  margin-top: 0.3rem;
  font-size: 0.875rem;
`;

export const FooterSection = () => {
  const { t } = useTranslation(['common']);
  return (
    <Footer>
      <Content>
        <SectionContainer>
          <Section>
            <FSectionTitle>{t('footer.company.title')}</FSectionTitle>
            {/*<Link to="/" className="link">
              About
              </Link>*/}
            <Link href="/contact">{t('footer.company.contact_us')}</Link>
            <Link href="/brand-assets">{t('footer.company.brand_assets')}</Link>
            <Link href="/business-development">
              {t('footer.company.business_dev')}
            </Link>
            {/* <Link to="/">
              Careers
            </Link> */}
            {partnersData.length > 0 && (
              <Link href="/partners" passHref>
                {t('footer.company.partners')}
              </Link>
            )}
            <LinkOut href="https://medium.com/flexpool/">
              {' '}
              {t('footer.company.blog')}
            </LinkOut>
            <LinkOut href="https://static.flexpool.io/legal/terms.pdf">
              {' '}
              {t('footer.company.terms')}
            </LinkOut>
            <LinkOut href="https://static.flexpool.io/legal/privacy-policy.pdf">
              {t('footer.company.pp')}
            </LinkOut>
          </Section>
          <Section>
            <FSectionTitle>{t('footer.resources.title')}</FSectionTitle>
            <Link href="/get-started">{t('footer.resources.get_started')}</Link>
            <Link href="/faq">{t('footer.resources.faq')}</Link>
            <Link href="/transparency">Transparency Reports</Link>
            <Link href="/docs/api">{t('footer.resources.api_docs')}</Link>
            <LinkOut href="https://www.gasprice.io/">Gasprice.io</LinkOut>
            <LinkOut
              download
              href="https://static.flexpool.io/dl/android-app/flexpool-android-v1.0.0.apk"
            >
              Android APK
            </LinkOut>
          </Section>
          <Section>
            <FSectionTitle>{t('footer.community.title')}</FSectionTitle>
            <LinkOut href={DISCORD_LINK}>Discord</LinkOut>
            <LinkOut href={REDDIT_LINK}>Reddit</LinkOut>
            <LinkOut href={TELEGRAM_LINK}>Telegram</LinkOut>
            <LinkOut href={TELEGRAM_LINK_CN}>Telegram (中文)</LinkOut>
          </Section>
          <Section>
            <FSectionTitle>{t('footer.contact.title')}</FSectionTitle>
            <LinkOut href="https://status.flexpool.io">
              {t('footer.contact.service_status')}
            </LinkOut>
            <Link href="/support">{t('footer.contact.support')}</Link>
          </Section>
          <Section>
            <FSectionTitle>{t('footer.preferences.title')}</FSectionTitle>
            <NewSelectCounterTicker />
            <Spacer />
            <NewSelectTheme />
            <Spacer />
            <NewSelectLanguage />
            <HelpText>
              <LinkOut href="https://crowdin.com/project/flexpoolio-website">
                {t('footer.translation_help')}
              </LinkOut>
            </HelpText>
          </Section>
        </SectionContainer>

        <LinkOut
          href="https://apps.apple.com/app/flexpool-io/id1594014411"
          style={{ display: 'inline-block' }}
        >
          <Image
            src="/svg/download-on-the-app-store.svg"
            width={123}
            height={41}
            alt="Download on the app store"
          />
        </LinkOut>

        <FooterEnd>
          <FooterCompany>
            <FooterLogo
              width="50"
              height="30"
              src="https://static.flexpool.io/assets/brand/icon.svg"
              alt="Flexpool Icon White"
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {t('footer.bottom_message', {
                currentYear: new Date().getFullYear(),
              })}
              <LinkOut
                href="https://github.com/flexpool/frontend"
                style={{ marginLeft: '10px' }}
              >
                Open Source
              </LinkOut>
            </div>
          </FooterCompany>
          <SocialIcons>
            <LinkOut aria-label="Discord chat" href={DISCORD_LINK}>
              <FaDiscord />
            </LinkOut>
            <LinkOut aria-label="Telegram bot" href={TELEGRAM_LINK}>
              <FaTelegram />
            </LinkOut>
            <LinkOut aria-label="Reddit community page" href={REDDIT_LINK}>
              <FaReddit />
            </LinkOut>
            <LinkOut aria-label="Twitter account" href={TWITTER_LINK}>
              <FaTwitter />
            </LinkOut>
            <LinkOut aria-label="Medium articles" href={MEDIUM_LINK}>
              <FaMedium />
            </LinkOut>
            <LinkOut aria-label="Github repositories" href={GITHUB_LINK}>
              <FaGithub />
            </LinkOut>
          </SocialIcons>
        </FooterEnd>
      </Content>
    </Footer>
  );
};
