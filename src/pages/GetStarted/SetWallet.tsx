import { Form, Formik } from 'formik';
import { useHistory, useLocation } from 'react-router';
import qs from 'query-string';
import { TextField } from 'src/components/Form/TextInput';
import { Highlight, Ws } from 'src/components/Typo/Typo';
import { Submit } from 'src/components/Form/Submit';
import styled from 'styled-components';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';

const FieldContainer = styled.div`
  display: flex;
  max-width: 760px;
  align-items: flex-end;
  & > *:not(:last-child) {
    flex-grow: 1;
    margin-right: 1rem;
  }
`;

export const SetWallet = () => {
  const history = useHistory();
  const { search } = useLocation();
  const parsedSearch = qs.parse(search);
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
      <Formik
        initialValues={{
          walletAddress:
            typeof parsedSearch.walletAddress === 'string'
              ? parsedSearch.walletAddress
              : '',
        }}
        onSubmit={(data, { setSubmitting }) => {
          const parsedSearch = qs.parse(search);
          history.replace({
            search: qs.stringify({
              ...parsedSearch,
              walletAddress: data.walletAddress,
            }),
          });
          setSubmitting(false);
        }}
      >
        <Form>
          <FieldContainer>
            <TextField
              label="What is your wallet address? (optional)"
              name="walletAddress"
              placeholder="Enter your wallet address"
            />
            <Submit>
              <Ws>Set wallet</Ws>
            </Submit>
          </FieldContainer>
        </Form>
      </Formik>
    </>
  );
};
