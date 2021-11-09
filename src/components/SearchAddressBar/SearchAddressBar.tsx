import { Formik } from 'formik';
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useOpenState } from 'src/hooks/useOpenState';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { fetchApi } from 'src/utils/fetchApi';
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
            router.push(`/miner/${res}/${searchAddress}`, undefined, {
              // shallow routing is true if not on miner dashboard
              shallow: !router.query.address,
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
