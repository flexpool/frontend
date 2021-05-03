import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { fetchApi } from 'src/utils/fetchApi';
import styled from 'styled-components/macro';
import { SearchAddressCachedResult } from './SearchAddressCachedResult';

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
  transition: 0.1s all;
  &:hover {
    box-shadow: inset 0 0 20px 0 rgba(0, 0, 0, 0.15);
    svg {
      transform: scale(1.1);
    }
  }

  svg {
    transition: 0.1s all;
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
    border-left: 1px solid var(--border-color);
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
  border: 1px solid var(--border-color) !important;
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
  const searchData = useReduxState('addressSearch');
  const { t } = useTranslation(['common']);
  const d = useDispatch();

  const handleSearch = React.useCallback(
    async (address: string) => {
      let searchAddress: string = address;
      if (!searchAddress) {
        if (searchData.length > 0) {
          searchAddress = searchData[0].address; // Fetch latest address from cache.
        } else {
          return;
        }
      }

      return searchState
        .start(
          fetchApi('/miner/locateAddress', {
            query: { address: searchAddress },
          })
        )
        .then((res) => {
          if (res) {
            d(
              addressSearchSet({
                coin: res,
                address: searchAddress,
              })
            );
            history.push(`/miner/${res}/${searchAddress}`);
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement?.blur();
            }
          } else {
            alert(
              'Specified address was not found in our system. Try waiting some time if you are already mining.'
            );
          }
          return res;
        });
    },
    // eslint-disable-next-line
    [history, searchData[0]?.address]
  );

  return (
    <Container>
      <Formik
        onSubmit={async (data, form) => {
          await handleSearch(data.addrsearch);
          form.setSubmitting(false);
          form.resetForm();
        }}
        initialValues={{ addrsearch: '' }}
      >
        <Form autoComplete="off">
          <Wrapper>
            <FieldWrapper>
              <Input
                name="addrsearch"
                spellCheck="false"
                autoComplete="off"
                placeholder={t('searchbar.placeholder')}
              />
              {showResult && searchData && searchData.length > 0 && (
                <ResultWrapper>
                  <SearchAddressCachedResult />
                </ResultWrapper>
              )}
            </FieldWrapper>
            <SearchButton aria-label="Search address" type="submit">
              <FaSearch />
            </SearchButton>
          </Wrapper>
        </Form>
      </Formik>
    </Container>
  );
};
