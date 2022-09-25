import React from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { Page } from '@/components/layout/Page';
import { Content } from '@/components/layout/Content';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Spacer } from '@/components/layout/Spacer';
import { SearchAddressBar } from '@/components/SearchAddressBar/SearchAddressBar';
import AddressCard, { AddressStatus } from '@/pages/Search/AddressCard';
import { getPropsFromLocateAddress } from '@/pages/Search/utils';

export const TickerName = styled.span`
  color: var(--text-tertiary);
`;

const SearchHeader = styled.div`
  border-bottom: 1px solid var(--border-color);
  padding: 16px 0;
  z-index: 1;
`;

const Search = ({
  address,
  dashboards,
  status,
  isAddressValid,
}: {
  isAddressValid: boolean;
  status: AddressStatus;
  dashboards: string[];
  address: string;
}) => {
  const router = useRouter();
  const { t: seoT } = useTranslation('seo');
  const { t } = useTranslation('search');

  return (
    <Page>
      <NextSeo
        title={seoT('title.search')}
        description={seoT('website_description.search')}
        noindex
      />
      <SearchHeader>
        <Content md padding>
          <h2>{t('header')}</h2>
          <SearchAddressBar initialValue={router.query.search as string} />
        </Content>
      </SearchHeader>
      <Content
        md
        padding
        style={{
          minHeight: '400px',
        }}
      >
        <h2>{t('search_result')}</h2>
        {isAddressValid ? (
          <AddressCard
            address={address}
            status={status}
            dashboards={dashboards}
          />
        ) : (
          <p>{t('invalid_address')}</p>
        )}

        <Spacer />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchString = context.query.search as string | undefined;

  const { dashboards, addressStatus, isAddressValid } =
    await getPropsFromLocateAddress(searchString);

  if (dashboards.length === 1) {
    return {
      redirect: {
        destination: `/miner/${dashboards[0]}/${searchString}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, [
        'common',
        'cookie-consent',
        'seo',
        'search',
      ])),
      address: searchString || '',
      dashboards,
      status: addressStatus,
      isAddressValid,
    },
  };
};

export default Search;
