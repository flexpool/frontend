import React from 'react';
import { useTranslation } from 'next-i18next';
import { FaDiscord, FaReddit, FaTelegram } from 'react-icons/fa';
import { Button } from '@/components/Button';
import { ScrollArea } from '@/components/layout/ScrollArea';
import { Spacer } from '@/components/layout/Spacer';
import { NewSelectTheme } from '@/components/SelectTheme';
import { NewSelectCounterTicker } from '@/components/SelectCounterTicker';
import { NewSelectLanguage } from '@/components/SelectLanguage';
import { Ws } from '@/components/Typo/Typo';
import {
  MobileSlide,
  SlideHideRest,
  MobileNavLink,
  MobileNavTitle,
} from './components';
import { DISCORD_LINK, REDDIT_LINK, TELEGRAM_LINK } from '@/constants';

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <MobileSlide isOpen={isOpen}>
      <SlideHideRest isOpen={isOpen} onClick={onClose} />
      <ScrollArea>
        <MobileNavLink url="/statistics" onClick={onClose}>
          {t('common:nav.statistics')}
        </MobileNavLink>

        <MobileNavLink url="/blocks" onClick={onClose}>
          {t('common:nav.blocks')}
        </MobileNavLink>

        <MobileNavLink url="/miners" onClick={onClose}>
          {t('common:nav.miners')}
        </MobileNavLink>

        <MobileNavLink url="/faq" onClick={onClose}>
          {t('common:nav.faq')}
        </MobileNavLink>

        <MobileNavLink url="/support" onClick={onClose}>
          {t('common:nav.support')}
        </MobileNavLink>

        <MobileNavTitle>{t('common:nav.community_title')}</MobileNavTitle>
        <MobileNavLink url={DISCORD_LINK} onClick={onClose} external>
          <FaDiscord /> Discord
        </MobileNavLink>
        <MobileNavLink url={REDDIT_LINK} onClick={onClose} external>
          <FaReddit /> Reddit
        </MobileNavLink>
        <MobileNavLink url={TELEGRAM_LINK} onClick={onClose} external>
          <FaTelegram /> Telegram
        </MobileNavLink>
      </ScrollArea>
      <div>
        <MobileNavLink url="/get-started" onClick={onClose}>
          <Button shape="block" variant="primary">
            <Ws>{t('common:nav.get_started')}</Ws>
          </Button>
        </MobileNavLink>
        <Spacer />
        <NewSelectCounterTicker />
        <Spacer />
        <NewSelectTheme />
        <Spacer />
        <NewSelectLanguage />
      </div>
    </MobileSlide>
  );
};

export default MobileDrawer;
