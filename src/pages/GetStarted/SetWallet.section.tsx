import { useHistory, useLocation } from 'react-router';
import qs from 'query-string';
import { TextInput } from 'src/components/Form/TextInput';
import { DivText, Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import React from 'react';
import { MineableCoin } from './mineableCoinList';
import { Trans, useTranslation } from 'react-i18next';
export const SetWalletSection: React.FC<{ data: MineableCoin }> = ({
  data: { walletAddressExample, validator },
}) => {
  const history = useHistory();
  const { search } = useLocation();
  const { t } = useTranslation('get-started');

  const initValue = React.useMemo(() => {
    const parsedSearch = qs.parse(search);
    return parsedSearch.walletAddress || '';
    // eslint-disable-next-line
  }, []);

  const [checksumError, setChecksumError] = React.useState(false);
  const [value, setValue] = React.useState(initValue || '');

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
      const parsedSearch = qs.parse(search);

      const checksum = validator(value);

      setChecksumError(!checksum);

      if (!!checksum) {
        history.replace({
          search: qs.stringify({
            ...parsedSearch,
            walletAddress: !!checksum ? checksum : '',
          }),
        });
        setValue(checksum);
      }
    },
    [search, history, validator]
  );

  return (
    <>
      <h2>
        <Highlight>#1</Highlight> {t('detail.wallet.title')}
      </h2>
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
        <TextInput
          autoComplete="off"
          spellCheck="false"
          label={t('detail.wallet.wallet_address')}
          placeholder={walletAddressExample}
          value={value}
          onChange={handleInputChange}
          errorMessage={
            checksumError ? t('detail.wallet.invalid_address') : null
          }
        />
      </DivText>
    </>
  );
};
