import React from 'react';
import { useTranslation, Trans } from 'next-i18next';
import { FaDiscord, FaTelegram } from 'react-icons/fa';

import { Content } from 'src/components/layout/Content';
import { Divider } from 'src/components/layout/Divider';
import { HeroBlue } from 'src/components/layout/Hero/HeroBlue';
import { Page } from 'src/components/layout/Page';
import { DISCORD_LINK, TELEGRAM_LINK } from 'src/constants';
import styled from 'styled-components';

const SupportChannelWrapper = styled.a`
  border: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  svg {
    height: 30px;
    width: 30px;
    margin-right: 0.5rem;
  }
  & + & {
    margin-left: 1rem;
  }
`;

const SupportChannel: React.FC<{
  name: string;
  icon: React.ReactNode;
  href: string;
}> = ({ name, icon, href }) => {
  return (
    <SupportChannelWrapper
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {icon}
      <div className="name">{name}</div>
    </SupportChannelWrapper>
  );
};

export const SupportPage = () => {
  const { t } = useTranslation('support');
  return (
    <Page>
      <HeroBlue>
        <Content md>
          <h1>{t('title')}</h1>
        </Content>
      </HeroBlue>
      <Content md paddingLg>
        <h2>{t('section_one.title')}</h2>
        <p>{t('section_one.description')}</p>
        <Divider margin />
        <h2>{t('section_two.title')}</h2>
        <p>{t('section_two.description')}</p>
        <Divider margin />
        <h2>{t('section_three.title')}</h2>
        <p>{t('section_three.description')}</p>
        <div className="support-channels">
          <SupportChannel
            name={'Discord'}
            icon={<FaDiscord />}
            href={DISCORD_LINK}
          />
          <SupportChannel
            name={'Telegram'}
            icon={<FaTelegram />}
            href={TELEGRAM_LINK}
          />
        </div>
        <Divider margin />
        <h2>{t('section_four.title')}</h2>
        <p>
          <Trans
            ns={'support'}
            i18nKey="section_four.description" // optional -> fallbacks to defaults if not provided
            values={{ email: 'support@flexpool.io' }}
            components={{
              // eslint-disable-next-line
              email: <a href="mailto:support@flexpool.io" />,
            }}
          />
        </p>
        <Divider margin />
        <h2>{t('section_five.title')}</h2>
        <p>
          <Trans
            ns={'support'}
            i18nKey="section_five.description" // optional -> fallbacks to defaults if not provided
            values={{ email: 'hq@flexpool.io' }}
            components={{
              // eslint-disable-next-line
              email: <a href="mailto:hq@flexpool.io" />,
            }}
          />
        </p>
      </Content>
    </Page>
  );
};

export default SupportPage;
