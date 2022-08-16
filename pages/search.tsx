import React from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { Page } from '@/components/layout/Page';
import { Content } from '@/components/layout/Content';
import { fetchApi } from '@/utils/fetchApi';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Spacer } from '@/components/layout/Spacer';
import { SearchAddressBar } from '@/components/SearchAddressBar/SearchAddressBar';
import AddressCard, { AddressStatus } from '@/pages/Search/AddressCard';
import { getChecksumByTicker } from '@/utils/validators/checksum';

export const TickerName = styled.span`
  color: var(--text-tertiary);
`;

type LocateAddressResponse = {
  all: string[];
  error: string | null;
  pendingStats: boolean;
  result: string | null;
};

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

  return (
    <Page>
      <NextSeo title="Search" noindex />
      <SearchHeader>
        <Content md padding>
          <h2>Search by Address</h2>
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
        <h2>Search Result</h2>
        {isAddressValid ? (
          <AddressCard
            address={address}
            status={status}
            dashboards={dashboards}
          />
        ) : (
          <p>Please enter a valid Ethereum or Chia wallet address.</p>
        )}

        <Spacer />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchString = context.query.search as string | undefined;

  let addressStatus: AddressStatus = 'not-found';
  let dashboards: string[] = [];
  let addressType: string | undefined = undefined;

  if (searchString) {
    if (getChecksumByTicker('eth')(searchString)) addressType = 'eth';
    if (getChecksumByTicker('xch')(searchString)) addressType = 'xch';

    const result = await fetchApi<LocateAddressResponse>(
      '/miner/locateAddress',
      {
        query: {
          address: searchString,
        },
        raw: true,
      }
    );

    const { all } = result;

    // TODO: this piece of code has to be tested
    const isPending = result.pendingStats === true;
    const isMining = !isPending && result.result !== null;

    if (isPending) {
      if (addressType === 'eth') dashboards = ['eth', 'etc'];
      if (addressType === 'xch') dashboards = ['xch'];
      addressStatus = 'pending';
    } else if (isMining) {
      dashboards = all;
      addressStatus = 'mining';
    }

    if (dashboards.length === 1) {
      return {
        redirect: {
          destination: `/miner/${all[0]}/${searchString}?fromSearch=true`,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, [
        'common',
        'dashboard',
        'blocks',
        'cookie-consent',
      ])),
      address: searchString,
      dashboards,
      status: addressStatus,
      isAddressValid: addressType !== undefined,
    },
  };
};

export default Search;
