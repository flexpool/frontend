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

const LinkOut: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
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
    color: var(--text-secondary);
    display: block;
    padding: 0.3rem 0;
    &:hover {
      color: var(--text-primary);
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
            <LinkOut href="https://discord.gg/96TS7h3uj8">Discord</LinkOut>
            <LinkOut href="https://www.reddit.com/user/flexpool">
              Reddit
            </LinkOut>
            <LinkOut href="https://t.me/flexpool">Telegram</LinkOut>
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
            <div>
              © 2020-{new Date().getFullYear()} Flexpool, LLC or its
              affilliates. All rights reserved.
            </div>
          </FooterCompany>
          <SocialIcons>
            <LinkOut href="https://discord.gg/Pvw74Cv">
              <FaDiscord />
            </LinkOut>
            <LinkOut href="https://t.me/flexpool">
              <FaTelegram />
            </LinkOut>
            <LinkOut href="https://www.reddit.com/user/flexpool">
              <FaReddit />
            </LinkOut>
            <LinkOut href="https://twitter.com/flexpool_io">
              <FaTwitter />
            </LinkOut>
            <LinkOut href="https://medium.com/flexpool/">
              <FaMedium />
            </LinkOut>
            <LinkOut href="https://github.com/flexpool">
              <FaGithub />
            </LinkOut>
          </SocialIcons>
        </FooterEnd>
      </Content>
    </Footer>
  );
};
