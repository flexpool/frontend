import React from 'react';
import { TextField } from 'src/components/Form/TextInput';
import { DivText } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { MineableCoin } from '../mineableCoinList';
import { Trans, useTranslation } from 'next-i18next';
import { SectionWrapper } from '../common/SectionWrapper';

// TODO: use common wallet text field

type SetWalletSectionProps = {
  data: MineableCoin;
  name?: string;
  position: number;
};

export const SetWalletSection = ({
  data: { walletAddressExample, validator },
  name = 'wallet_address',
  position,
}: SetWalletSectionProps) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={position} title={t('detail.wallet.title')}>
      <p>
        <Trans
          ns="get-started"
          i18nKey="detail.wallet.desc_one"
          components={{
            binance: (
              <LinkOut href="https://www.binance.com/en/register?ref=B2675KF5" />
            ),
            coinbase: <LinkOut href="https://www.coinbase.com" />,
          }}
        />
      </p>
      <p>
        <Trans
          ns="get-started"
          i18nKey="detail.wallet.desc_two"
          components={{
            ledger: <LinkOut href="https://www.ledger.com/" />,
            trezor: <LinkOut href="https://trezor.io/" />,
            strong: <strong />,
          }}
        />
      </p>
      <Spacer />
      <DivText>
        <TextField
          validate={(value) => {
            if (value === '' || typeof value === 'undefined') return undefined;

            const r = validator(value);
            if (typeof r === 'string' && r !== '') return undefined;
            return t('detail.wallet.invalid_address') as string;
          }}
          name={name}
          autoComplete="off"
          spellCheck="false"
          label={t('detail.wallet.wallet_address')}
          placeholder={walletAddressExample}
        />
      </DivText>
    </SectionWrapper>
  );
};
