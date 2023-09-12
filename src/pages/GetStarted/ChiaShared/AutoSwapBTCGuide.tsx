import { TextField } from '@/components/Form/TextInput';
import { TerminalCommand } from '../ChiaCli/TerminalCommand';
import { GuideForm } from '../common';
import { Spacer } from '@/components/layout/Spacer';
import { Mono } from '@/components/Typo/Typo';
import { ChiaGuiMenu } from '../ChiaGui/Guide.page';
import styled, { keyframes } from 'styled-components';
import { FiMoreVertical } from 'react-icons/fi';
import { Code } from '@/components/Code/Code';
import { Trans, useTranslation } from 'next-i18next';

const CLI = () => {
  const { t } = useTranslation('get-started');

  return (
    <GuideForm
      initialValue={{
        launcherId: '',
        btc_address: '',
      }}
    >
      {({ values }) => {
        const cmdAddress = values.btc_address
          ? `btc:${values.btc_address}`
          : `<btc:BTC_WALLET>`;

        const cmdLauncherId = values.launcherId
          ? values.launcherId
          : '<LAUNCHER_ID>';

        return (
          <div
            style={{
              maxWidth: 800,
            }}
          >
            <p>{t('detail_xch.btc_payout.intro')}</p>

            <Spacer />

            <p>
              <Trans
                t={t}
                i18nKey={'detail_xch.btc_payout.paste_info'}
                components={{
                  mono: <Mono />,
                }}
              />
            </p>
            <Spacer size="sm" />

            <div
              style={{
                maxWidth: 500,
              }}
            >
              <TextField
                name="launcherId"
                label={'Launcher ID'}
                placeholder="4973f2b459881b08295dff931c26d..."
              />

              <Spacer size="md" />

              <TextField
                name="btc_address"
                label={'Bitcoin wallet address'}
                placeholder="bc1q5zx6dqklmnjq9gffv70fsrz7uaulmr65vyf0hj"
              />
            </div>

            <Spacer size="lg" />

            <p>{t('detail_xch.btc_payout.run_cmd')}</p>
            <TerminalCommand
              cmd={`chia plotnft change_payout_instructions -l ${cmdLauncherId} -a ${cmdAddress}`}
            />
          </div>
        );
      }}
    </GuideForm>
  );
};

const ChiaGuiSidebarItemWrapperGlowAnimation = keyframes`
  0% {
    background-color: var(--bg-secondary);
  }

  50% {
    background-color: var(--border-color);
  }

  100% {
    background-color: var(--bg-secondary);
  }
`;

const Highlight = styled.div`
  animation: ${ChiaGuiSidebarItemWrapperGlowAnimation} 1s linear infinite;
`;

const MockDropdownMenuItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-secondary);
`;

const MockDropdownMenu = () => {
  return (
    <div
      style={{
        maxWidth: '240px',
        borderRadius: '4px',
        backgroundColor: 'var(--bg-secondary)',
        padding: '8px 0',
        marginLeft: 'auto',
        marginTop: '4px',
      }}
    >
      <MockDropdownMenuItem>Add a plot</MockDropdownMenuItem>
      <MockDropdownMenuItem>View pool login link</MockDropdownMenuItem>
      <Highlight>
        <MockDropdownMenuItem>Edit payout instructions</MockDropdownMenuItem>
      </Highlight>
      <MockDropdownMenuItem>
        Delete unconfirmed transactions
      </MockDropdownMenuItem>
    </div>
  );
};

const EditPayoutInstructions = () => {
  return (
    <div>
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          height: '32px',
          width: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          marginLeft: 'auto',
        }}
      >
        <FiMoreVertical />
      </div>
      <MockDropdownMenu />
    </div>
  );
};

const GUI = () => {
  const { t } = useTranslation('get-started');
  return (
    <div>
      <p>{t('detail_xch.btc_payout.intro')}</p>
      <Spacer />
      <p>{t('detail_xch.btc_payout.gui_instruction')}</p>
      <Trans
        t={t}
        i18nKey={'detail_xch.btc_payout.paste_info'}
        components={{
          mono: <Mono />,
          b: <b />,
        }}
      />
      <Spacer />
      <ChiaGuiMenu
        selectedMenu="Pool"
        menuContent={<EditPayoutInstructions />}
      />
    </div>
  );
};

export { CLI, GUI };
