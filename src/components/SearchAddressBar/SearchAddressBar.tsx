import { Formik, useField } from 'formik';
import React, { useRef, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { FaSearch } from 'react-icons/fa';
import { useOpenState } from 'src/hooks/useOpenState';
import useSearchAddress from '@/hooks/useSearchAddress';
import { useReduxState } from 'src/rdx/useReduxState';
import {
  SearchButton,
  Container,
  Wrapper,
  ResultWrapper,
  FieldWrapper,
  Input,
  F,
} from './components';
import { SearchAddressCachedResult } from './SearchAddressCachedResult';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { Spacer } from '../layout/Spacer';
import { getChecksumByTicker } from '@/utils/validators/checksum';

export const SearchAddressBarProvider = ({ children }) => {};

export const SearchAddressBar: React.FC<{
  showResult?: boolean;
  callback?: () => void;
}> = ({ showResult = true, callback }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const searchData = useReduxState('addressSearch');
  const { t } = useTranslation(['common']);
  const openState = useOpenState();
  const search = useSearchAddress();

  const handleSearch = React.useCallback(
    (address: string, coin?: string, callback?: () => void) => {
      let searchAddress: string = address.replaceAll(' ', '');
      if (/^[a-fA-F0-9]{40}$/.test(address)) {
        searchAddress = '0x' + searchAddress;
      }

      if (!searchAddress && searchData.length > 0) {
        searchAddress = searchData[0].address; // Fetch latest address from cache.
      }

      inputRef.current?.blur();
      return search(searchAddress, coin, callback);
    },
    [search, searchData]
  );

  const shouldShowSearchHistory = useMemo(
    () => openState.isOpen && showResult && searchData && searchData.length > 0,
    [openState.isOpen, showResult, searchData]
  );

  return (
    <Container
      onOuterEvent={(openState.isOpen && openState.handleClose) || undefined}
    >
      <Formik
        onSubmit={(data, form) => {
          handleSearch(data.addrsearch, data.coin, () => {
            callback?.(); // handle component callback, such as closing modal
            form.setSubmitting(false);
            form.resetForm();
            openState.handleClose();
          });
        }}
        initialValues={{ addrsearch: '', coin: undefined }}
      >
        <F autoComplete="off">
          <Wrapper>
            <FieldWrapper isOpen={openState.isOpen}>
              <Input
                innerRef={inputRef}
                name="addrsearch"
                spellCheck="false"
                autoComplete="off"
                placeholder={t('searchbar.placeholder')}
                onFocus={openState.handleOpen}
              />
              {shouldShowSearchHistory && (
                <ResultWrapper>
                  {/* <CoinPreference /> */}
                  <SearchAddressCachedResult
                    callback={() => {
                      inputRef.current?.blur();
                      openState.handleClose();
                    }}
                  />
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

type CoinLabelProps = {
  selected: boolean;
};

const CoinLabel = styled.button<CoinLabelProps>`
  display: inline-block;
  cursor: pointer;
  background: ${(p) => (p.selected ? 'var(--primary)' : 'none')};
  color: ${(p) => (p.selected ? 'var(--text-on-bg)' : p.theme.text.secondary)};
  box-shadow: ${(p) =>
    p.selected ? 'none' : `inset 0px 0px 0px 1px ${p.theme.text.secondary}`};
  padding: 6px 16px;
  text-transform: uppercase;
  font-weight: 500;
  border-radius: 5px;
  font-size: 0.875rem;
  border: none;
`;

const CoinPreferencesLayout = styled.div`
  ${CoinLabel} + ${CoinLabel} {
    margin-left: 0.5rem;
  }
`;

const SearchResultSection = styled.div`
  text-align: left;
  padding: 16px 16px 16px;
  transition: all 300ms ease-in-out;
`;

const SectionTitle = styled.div`
  color: ${(p) => p.theme.text.secondary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
`;

const CoinPreferences = () => {
  const [coinPreference, setCoinPreference] = useLocalStorageState(
    'coin-preference-v1',
    'eth'
  );

  const [field, , helpers] = useField('coin');

  useEffect(() => {
    if (!field.value) {
      helpers.setValue(coinPreference);
    }
  }, [field, helpers, coinPreference]);

  useEffect(() => {
    if (coinPreference !== field.value) {
      setCoinPreference(field.value);
    }
  }, [field.value, coinPreference, setCoinPreference]);

  useEffect(() => {
    return () => {
      helpers.setValue(undefined);
    };
  }, []);

  return (
    <CoinPreferencesLayout>
      <CoinLabel
        type="button"
        selected={field.value === 'eth'}
        onClick={() => {
          helpers.setValue('eth');
        }}
      >
        ETH
      </CoinLabel>
      <CoinLabel
        type="button"
        selected={field.value === 'etc'}
        onClick={() => {
          helpers.setValue('etc');
        }}
      >
        ETC
      </CoinLabel>
    </CoinPreferencesLayout>
  );
};

const CoinPreference = () => {
  const [field, , helpers] = useField('addrsearch');

  if (!field.value || !getChecksumByTicker('eth')(field.value)) {
    return null;
  }

  return (
    <SearchResultSection>
      <SectionTitle>Coin Preference</SectionTitle>
      <Spacer size="sm" />
      <CoinPreferences />
    </SearchResultSection>
  );
};
