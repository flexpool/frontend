import { Formik } from 'formik';
import React from 'react';
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
  const router = useRouter();
  const isMounted = useIsMounted();

  const searchData = useReduxState('addressSearch');
  const { t } = useTranslation(['common']);
  const openState = useOpenState();

  const search = useSearchAddress({
    onSuccess: (coin, address) => {
      if (coin) {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement?.blur();
        }
        openState.handleClose();
        router.push(`/miner/${coin}/${address}`, undefined, {
          // shallow routing is true if not on miner dashboard
          shallow: !router.query.address,
        });
      }
    },
  });

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

      return search(searchAddress);
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
          handleSearch(data.addrsearch).then(() => {
            form.setSubmitting(false);
            form.resetForm();
          });
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
