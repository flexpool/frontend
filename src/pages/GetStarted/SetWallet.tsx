import { Form, Formik } from 'formik';
import { useHistory, useLocation } from 'react-router';
import qs from 'query-string';
import { TextField } from 'src/components/Form/TextInput';
import { Highlight } from 'src/components/Typo/Typo';
import { Submit } from 'src/components/Form/Submit';
import styled from 'styled-components';
import { Spacer } from 'src/components/layout/Spacer';

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
      <p>Some description</p>
      <Spacer />
      <Formik
        initialValues={{ walletAddress: `${parsedSearch.walletAddress}` }}
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
            <Submit>Set wallet</Submit>
          </FieldContainer>
        </Form>
      </Formik>
    </>
  );
};
