import { Link } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';
import styled from 'styled-components/macro';
import IconLogo from 'src/assets/logo_icon_white.svg';

import {
  FaDiscord,
  FaTelegram,
  FaReddit,
  FaTwitter,
  FaMedium,
  FaGithub,
} from 'react-icons/fa';
import React from 'react';
import { SelectCounterTicker } from 'src/components/SelectCounterTicker';
import { SelectTheme } from 'src/components/SelectTheme';
import { Spacer } from 'src/components/layout/Spacer';
import {
  DISCORD_LINK,
  GITHUB_LINK,
  MEDIUM_LINK,
  REDDIT_LINK,
  TELEGRAM_LINK,
  TWITTER_LINK,
} from 'src/constants';

const LinkOut: React.FC<{
  href: string;
  style?: Object;
  children: React.ReactNode;
}> = ({ href, children, style }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
    {children}
  </a>
);

const Footer = styled.footer`
  border-top: 6px solid var(--primary);
  background: #020e1f;
  padding-top: 5rem;
  padding-bottom: 5rem;

  color: var(--text-secondary);

  a {
    color: #77869e;
    display: block;
    padding: 0.3rem 0;
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

const FooterLogo = styled.img`
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

export const FooterSection = () => {
  return (
    <Footer>
      <Content>
        <SectionContainer>
          <Section>
            <FSectionTitle>Company</FSectionTitle>
            {/*<Link to="/" className="link">
              About
              </Link>*/}
            <Link to="/contact">Contact Us</Link>
            <Link to="/brand-assets">Brand Assets</Link>
            <Link to="/business-development">Business Development</Link>
            {/* <Link to="/">
              Careers
            </Link> */}
            <Link to="/partners">Partners</Link>
            <LinkOut href="https://medium.com/flexpool/">Blog</LinkOut>
            <LinkOut href="https://flexpool.io/legal/FP-TO.pdf">Terms</LinkOut>
            <LinkOut href="https://flexpool.io/legal/FP-PP.pdf">
              Privacy Policy
            </LinkOut>
          </Section>
          <Section>
            <FSectionTitle>Resources</FSectionTitle>
            <Link to="/get-started">Getting Started</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/open-data-reports">Open Data Reports</Link>
            <LinkOut href="/">API Documentation</LinkOut>
          </Section>
          <Section>
            <FSectionTitle>Community</FSectionTitle>
            <LinkOut href={DISCORD_LINK}>Discord</LinkOut>
            <LinkOut href={REDDIT_LINK}>Reddit</LinkOut>
            <LinkOut href={TELEGRAM_LINK}>Telegram</LinkOut>
          </Section>
          <Section>
            <FSectionTitle>Contact</FSectionTitle>
            <LinkOut href="https://flexpool.statuspage.io/">
              Services Status
            </LinkOut>
            <Link to="/support">Support</Link>
          </Section>
          <Section>
            <FSectionTitle>Preferences</FSectionTitle>
            <SelectCounterTicker />
            <Spacer />
            <SelectTheme />
          </Section>
        </SectionContainer>
        <FooterEnd>
          <FooterCompany>
            <FooterLogo src={IconLogo} alt="Flexpool Icon White" />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              © 2020-{new Date().getFullYear()} Flexpool.io or its affiliates.
              All rights reserved.
              <LinkOut
                href="https://github.com/flexpool/frontend"
                style={{ marginLeft: '10px' }}
              >
                Open Source
              </LinkOut>
            </div>
          </FooterCompany>
          <SocialIcons>
            <LinkOut href={DISCORD_LINK}>
              <FaDiscord />
            </LinkOut>
            <LinkOut href={TELEGRAM_LINK}>
              <FaTelegram />
            </LinkOut>
            <LinkOut href={REDDIT_LINK}>
              <FaReddit />
            </LinkOut>
            <LinkOut href={TWITTER_LINK}>
              <FaTwitter />
            </LinkOut>
            <LinkOut href={MEDIUM_LINK}>
              <FaMedium />
            </LinkOut>
            <LinkOut href={GITHUB_LINK}>
              <FaGithub />
            </LinkOut>
          </SocialIcons>
        </FooterEnd>
      </Content>
    </Footer>
  );
};
