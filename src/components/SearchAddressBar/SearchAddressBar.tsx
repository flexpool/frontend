import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
// import { useHistory, useLocation } from 'react-router-dom';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useOpenState } from 'src/hooks/useOpenState';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { fetchApi } from 'src/utils/fetchApi';
import styled from 'styled-components';
import { OuterEvent } from '../DivOuterEvents';
import { SearchAddressCachedResult } from './SearchAddressCachedResult';
import { useRouter } from 'next/router';

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

  svg {
    transition: 0.1s all;
    display: block;
    fill: white;
    height: 40%;
    width: 40%;
  }

  &:focus {
    svg {
      transform: scale(0.9) !important;
    }
  }
`;
const Container = styled(OuterEvent)`
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
  border: 1px solid var(--border-color);
  border-top: none;
  transition: 0.2s all;
  opacity: 0;
  visibility: hidden;

  box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
  &:before {
    content: '';
    height: 3px;
    width: 3px;
    position: absolute;
    bottom: 100%;
    left: -1px;
    background: var(--bg-primary);
    border-left: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
`;
const FieldWrapper = styled.div<{ isOpen: boolean }>`
  height: 100%;
  position: relative;
  flex-grow: 1;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.07);
  border-radius: 5px;
  transition: 0.1s all;
  &:hover {
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.12);
  }

  ${(p) =>
    p.isOpen &&
    `
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2) !important;
    ${ResultWrapper} {
      visibility: visible;
      opacity: 1;
    }
  `}
`;

const Input = styled(Field)`
  height: 100%;
  background-color: var(--bg-primary);
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
  transition: 0.1s all;
`;
const F = styled(Form)`
  &:hover {
    ${Input} {
      background-color: var(--bg-primary);
    }
    ${SearchButton} {
      box-shadow: inset 0 0 20px 0 rgba(0, 0, 0, 0.05);
      svg {
        transform: scale(1.1);
      }
    }
    ${ResultWrapper} {
      &:before {
        background-color: var(--bg-primary);
      }
    }
  }
`;

export const SearchAddressBar: React.FC<{ showResult?: boolean }> = ({
  showResult = true,
}) => {
  const searchState = useAsyncState<string | null>('addressSearch', null);
  const router = useRouter();

  const searchData = useReduxState('addressSearch');
  const { t } = useTranslation(['common']);
  const d = useDispatch();
  const openState = useOpenState();

  React.useEffect(() => {
    openState.handleClose();
    // eslint-disable-next-line
  }, [router.pathname]);

  const handleSearch = React.useCallback(
    async (address: string) => {
      let searchAddress: string = address.replaceAll(' ', '');
      if (/^[a-fA-F0-9]{40}$/.test(address)) {
        searchAddress = '0x' + searchAddress;
      }

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
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement?.blur();
            }
            openState.handleClose();
            console.log('here');
            router.push(`/miner/${res}/${searchAddress}`, undefined, {
              shallow: true,
            });
          } else {
            alert(t('errors.address_not_found'));
          }
          return res;
        });
    },
    // eslint-disable-next-line
    [router.pathname, searchData[0]?.address, t]
  );

  return (
    <Container
      onOuterEvent={(openState.isOpen && openState.handleClose) || undefined}
    >
      <Formik
        onSubmit={async (data, form) => {
          await handleSearch(data.addrsearch);
          form.setSubmitting(false);
          form.resetForm();
        }}
        initialValues={{ addrsearch: '' }}
      >
        <F autoComplete="off">
          <Wrapper>
            <FieldWrapper isOpen={openState.isOpen}>
              <Input
                name="addrsearch"
                spellCheck="false"
                autoComplete="off"
                placeholder={t('searchbar.placeholder')}
                onFocus={openState.handleOpen}
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
        </F>
      </Formik>
    </Container>
  );
};
