import React from 'react';
import { GetServerSideProps } from 'next';
import { Page } from '@/components/layout/Page';
import { Content } from '@/components/layout/Content';
import { fetchApi } from '@/utils/fetchApi';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { useRouter } from 'next/router';
import { getPoolCoins } from '@/hooks/api/usePoolCoinsQuery';

import styled from 'styled-components';

import { CoinLogo } from '@/components/CoinLogo';
import { HeaderStat } from '@/components/layout/StatHeader';
import useSearchAddress from '@/hooks/useSearchAddress';

const CoinColumnContainer = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin-right: 0.5rem;
  }
`;

export const TickerName = styled.span`
  color: var(--text-tertiary);
`;

interface SearchResult {
  address: string;
  coin: {
    ticker: string;
    name: string;
  };
}

type LocateAddressResponse = {
  all: string[];
  error: string | null;
  pendingStats: boolean;
  result: string | null;
};

const Search = ({ searchResults }: { searchResults: SearchResult[] }) => {
  const router = useRouter();
  const search = useSearchAddress();

  const columns: DynamicListColumn<SearchResult>[] = React.useMemo(
    () => [
      {
        skeletonWidth: 110,
        Component: ({ data }) => (
          <CoinColumnContainer>
            <CoinLogo size="lg" ticker={data.coin.ticker} />
            <span>{data.coin.name}</span>
            <TickerName>{data.coin.ticker.toUpperCase()}</TickerName>
          </CoinColumnContainer>
        ),
      },
      {
        skeletonWidth: 200,
        Component: ({ data }) => <div>{data.address}</div>,
      },
    ],
    []
  );

  const handleRowClick = (data: SearchResult) => {
    search(data.address, data.coin.ticker);
  };

  const renderSearchResult = () => {
    if (searchResults.length === 0) {
      return <div>No result found</div>;
    }

    return (
      <DynamicList
        data={searchResults}
        columns={columns}
        onRowClick={handleRowClick}
        hideHead
      />
    );
  };

  return (
    <Page>
      <HeaderStat hideCoinSelect>
        <h1>Search Address</h1>
      </HeaderStat>
      <Content
        padding
        style={{
          minHeight: '400px',
        }}
      >
        <div
          style={{
            maxWidth: 800,
          }}
        >
          <h3>
            There are {searchResults.length} result(s) to your search{' '}
            {router.query.search}
          </h3>

          {renderSearchResult()}
        </div>
      </Content>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchString = context.query.search;

  const searchResults: SearchResult[] = [];

  if (searchString) {
    const { all } = await fetchApi<LocateAddressResponse>(
      '/miner/locateAddress',
      {
        query: {
          address: searchString,
        },
        raw: true,
      }
    );

    if (all.length === 1) {
      return {
        redirect: {
          destination: `/miner/${all[0]}/${searchString}?fromSearch=true`,
          permanent: false,
        },
      };
    }

    const poolCoins = await getPoolCoins();

    const poolCoinsByTicker: { [key: string]: typeof poolCoins.coins[number] } =
      poolCoins.coins.reduce(
        (acc, coin) => ({
          ...acc,
          [coin.ticker]: coin,
        }),
        {}
      );

    all.forEach((coin) => {
      searchResults.push({
        address: searchString as string,
        coin: {
          ticker: coin,
          name: poolCoinsByTicker[coin].name || coin,
        },
      });
    });
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, [
        'common',
        'dashboard',
        'blocks',
        'cookie-consent',
      ])),
      searchResults,
    },
  };
};

export default Search;
