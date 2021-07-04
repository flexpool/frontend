import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCog } from 'react-icons/fa';
import Modal from 'src/components/Modal/Modal';
import { useOpenState } from 'src/hooks/useOpenState';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { NotificationSettings } from './components/NotificationSettings/NotificationSettings';
import { PayoutSettings } from './components/PayoutSettings/PayoutSettings';
import { Split, Nav, NavItem, PageWrapper, SettingsBtn } from './components';

const pageComponents = {
  payouts: PayoutSettings,
  notifications: NotificationSettings,
};

type SettingsPageKey = keyof typeof pageComponents;

export const MinerSettingsModal = () => {
  const openState = useOpenState();
  const [page, setPage] = React.useState<SettingsPageKey>('payouts');

  const activeCoin = useActiveCoin();
  const minerSettings = useReduxState('minerDetails');
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const { t } = useTranslation('dashboard');

  const navItems = [
    {
      val: t('settings.payouts_title'),
      title: t('settings.payouts_title'),
    },
    {
      val: t('settings.notifications_title'),
      title: t('settings.notifications_title'),
    },
  ];

  // disable opening when data is not loaded
  const disabled = !activeCoin || !minerSettings.data || !minerHeaderStats.data;

  const handleChangePage = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setPage((e.target as HTMLButtonElement).value as SettingsPageKey);
    },
    []
  );

  const PageComponent = pageComponents[page];

  return (
    <>
      <SettingsBtn
        disabled={disabled}
        onClick={openState.handleOpen}
        size="sm"
        variant="primary"
      >
        <FaCog /> <span>{t('settings.cta')}</span>
      </SettingsBtn>
      <Modal mobileFull {...openState.modalProps}>
        <Modal.Header>
          <h2>{t('settings.title')}</h2>
        </Modal.Header>
        <Split>
          <Nav>
            {navItems.map((item) => (
              <NavItem
                key={item.val}
                onClick={handleChangePage}
                value={item.val}
                size="sm"
                variant={item.val === page ? 'primary' : undefined}
              >
                {item.title}
              </NavItem>
            ))}
          </Nav>
          <PageWrapper>
            <PageComponent />
          </PageWrapper>
        </Split>
      </Modal>
    </>
  );
};
