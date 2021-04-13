import { Field, Form, Formik } from 'formik';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import styled from 'styled-components/macro';
import { SearchAddressCachedResult } from './SearchAddressCachedResult';
import { saveAddressToCache, searchAddressStorage } from './searchCache';

const SearchButton = styled.button`
  cursor: pointer;
  border: 0;
  border-radius: 0px 5px 5px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--primary);
  transition: 50ms;
  height: 100%;
  width: 50px;

  svg {
    display: block;
    fill: white;
    height: 40%;
    width: 40%;
  }
`;
const Container = styled.div`
  width: 100%;
  height: 50px;
  form {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
const Wrapper = styled.div`
  height: 100%;
  display: flex;
  width: 100%;
`;
const ResultWrapper = styled.div`
  position: absolute;
  z-index: 0;
  top: 100%;
  width: 100%;
  left: 0;
  background: var(--bg-primary);
  border-radius: 0px 0px 5px 5px;
  display: none;
  border: 1px solid var(--border-color);
  border-top: none;

  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  &:before {
    content: '';
    height: 5px;
    width: 100%;
    position: absolute;
    bottom: 100%;
    left: -1px;
    background: var(--bg-secondary);
  }
`;
const FieldWrapper = styled.div`
  height: 100%;
  position: relative;
  flex-grow: 1;
  &:focus-within {
    ${ResultWrapper} {
      display: block;
    }
  }
`;

const Input = styled(Field)`
  height: 100%;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 5px 0px 0px 5px;
  padding: 0 1rem;
  font-size: 1rem;
  outline: none;
  width: 100%;
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  display: block;
  color: var(--text-primary);
`;

export const SearchAddressBar: React.FC<{ showResult?: boolean }> = ({
  showResult = true,
}) => {
  const searchState = useAsyncState<string | null>('addressSearch', null);
  const history = useHistory();
  const searchData = searchAddressStorage.get() || [];

  const handleSearch = React.useCallback(
    async (address: string) => {
      return searchState
        .start(fetchApi('/miner/locateAddress', { query: { address } }))
        .then((res) => {
          if (res) {
            saveAddressToCache(res, address);
            history.push(`/miner/${res}/${address}`);
          } else {
            alert(
              'Specified address was not found in our system. Try waiting some time if you are already mining.'
            );
          }
          return res;
        });
    },
    // eslint-disable-next-line
    [history]
  );

  return (
    <Container>
      <Formik
        onSubmit={async (data, { setSubmitting }) => {
          await handleSearch(data.search);
          setSubmitting(false);
        }}
        initialValues={{ search: '' }}
      >
        <Form>
          <Wrapper>
            <FieldWrapper>
              <Input
                name="search"
                spellCheck="false"
                autoComplete="false"
                placeholder="Search by your mining address"
              />
              {showResult && searchData && searchData.length > 0 && (
                <ResultWrapper>
                  <SearchAddressCachedResult />
                </ResultWrapper>
              )}
            </FieldWrapper>
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </Wrapper>
        </Form>
      </Formik>
    </Container>
  );
};
