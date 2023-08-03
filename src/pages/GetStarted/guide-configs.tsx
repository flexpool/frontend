import { LinkOut } from '@/components/LinkOut';
import { Mono } from '@/components/Typo/Typo';
import { TFunction, Trans } from 'next-i18next';

export const getConfigs = (t: TFunction) => {
  const iron = {
    walletDescription: (
      <p>
        <Trans
          t={t}
          i18nKey={'detail_iron.wallet.desc_one'}
          components={{
            ifweb: (
              <LinkOut href="https://ironfish.network/use/get-started/installation" />
            ),
            oreos: <LinkOut href="https://github.com/hairtail/oreos-rust" />,
            mono: <Mono />,
          }}
        />
      </p>
    ),
    hidePingTestSection: true,
  };

  return {
    iron,
  };
};
