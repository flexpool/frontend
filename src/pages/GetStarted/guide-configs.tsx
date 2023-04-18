import { LinkOut } from '@/components/LinkOut';
import { TFunction, Trans } from 'next-i18next';

export const getConfigs = (t: TFunction) => {
  const iron = {
    walletDescription: (
      <p>
        <Trans
          t={t}
          i18nKey={'detail_tiron.wallet.desc_one'}
          components={{
            ifweb: (
              <LinkOut href="https://ironfish.network/use/get-started/installation" />
            ),
            oreos: <LinkOut href="https://github.com/hairtail/oreos-rust" />,
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
