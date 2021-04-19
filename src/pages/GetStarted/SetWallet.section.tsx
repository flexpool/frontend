import { useHistory, useLocation } from 'react-router';
import qs from 'query-string';
import { TextInput } from 'src/components/Form/TextInput';
import { Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import React from 'react';
export const SetWalletSection = () => {
  const history = useHistory();
  const { search } = useLocation();

  const value = React.useMemo(() => {
    const parsedSearch = qs.parse(search);
    return parsedSearch.walletAddress || '';
  }, [search]);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsedSearch = qs.parse(search);
      history.replace({
        search: qs.stringify({
          ...parsedSearch,
          walletAddress: value,
        }),
      });
    },
    [search, history]
  );

  return (
    <>
      <h2>
        <Highlight>#1</Highlight> Get your wallet address
      </h2>
      <p>
        The easiest way to get a wallet is to register on a{' '}
        <b>cryptocurrency exchange</b> like{' '}
        <LinkOut href="https://www.binance.com/en/register?ref=B2675KF5">
          Binance (Ref)
        </LinkOut>{' '}
        or <LinkOut href="https://www.coinbase.com">Coinbase</LinkOut>.
      </p>
      <p>
        Although exchanges are comfortable and easy to use, they are not very
        secure. You can use a non-custodial wallet, but the safest way to store
        your funds is to use a <b>hardware wallet</b>.{' '}
        <LinkOut href="https://www.ledger.com/">Ledger</LinkOut> and{' '}
        <LinkOut href="https://trezor.io/">Trezor</LinkOut> are the most popular
        ones.
      </p>
      <Spacer />
      <p>
        <TextInput
          label="Wallet Address (optional)"
          placeholder="0xYOURWALLETADDRESS"
          value={value}
          onChange={handleInputChange}
        />
      </p>
    </>
  );
};
