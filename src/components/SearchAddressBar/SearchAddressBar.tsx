import { Formik } from 'formik';
import React, { useRef } from 'react';
import { useRouter } from 'next/router';
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
import useIsMounted from '@/hooks/useIsMounted';

export const SearchAddressBar: React.FC<{ showResult?: boolean }> = ({
  showResult = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isMounted = useIsMounted();

  const searchData = useReduxState('addressSearch');
  const { t } = useTranslation(['common']);
  const openState = useOpenState();

  const search = useSearchAddress();

  React.useEffect(() => {
    openState.handleClose();
    // eslint-disable-next-line
  }, [router.pathname]);

  const handleSearch = React.useCallback(
    (address: string) => {
      let searchAddress: string = address.replaceAll(' ', '');
      if (/^[a-fA-F0-9]{40}$/.test(address)) {
        searchAddress = '0x' + searchAddress;
      }

      if (!searchAddress && searchData.length > 0) {
        searchAddress = searchData[0].address; // Fetch latest address from cache.
      }

      inputRef.current?.blur();
      return search(searchAddress);
    },
    [search, searchData]
  );

  return (
    <Container
      onOuterEvent={(openState.isOpen && openState.handleClose) || undefined}
    >
      <Formik
        onSubmit={(data, form) => {
          if (handleSearch(data.addrsearch)) {
            form.setSubmitting(false);
            form.resetForm();
          }
        }}
        initialValues={{ addrsearch: '' }}
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
                onBlur={openState.handleClose}
              />
              {isMounted && showResult && searchData && searchData.length > 0 && (
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
