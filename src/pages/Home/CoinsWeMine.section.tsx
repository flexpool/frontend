import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import DynamicList from 'src/components/layout/List/List';
import { usePoolCoins } from 'src/rdx/poolCoins/poolCoins.hooks';
import { useCounterValue } from 'src/utils/currencyValue';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  padding-top: 5rem;
  padding-bottom: 5rem;

  h2 {
    font-size: 2rem;
  }
`;

export const CoinsWeMineSection = () => {
  const poolCoinsState = usePoolCoins();

  return (
    <Wrapper>
      <Content contentCenter>
        <h2>Coins we mine</h2>
        <p>
          Flexpool is a Multi-Coin mining pool, which means that you can mine
          your multiple favorite coins on Flexpool.
        </p>
        <br />
        <DynamicList
          isLoading={poolCoinsState.isLoading}
          loadingRowsCount={1}
          columns={[
            {
              title: 'Name',
              skeletonWidth: 110,
              Component: ({ data }) => {
                return <>{data.name}</>;
              },
            },
            {
              title: 'Price',
              alignRight: true,
              skeletonWidth: 80,
              Component: ({ data }) => {
                const v = useCounterValue(data.marketData.prices);
                return <>{v}</>;
              },
            },
            {
              title: 'Market Cap',
              alignRight: true,
              skeletonWidth: 140,
              Component: ({ data }) => {
                const v = useCounterValue(data.marketData.marketCaps);
                return <>{v}</>;
              },
            },
            {
              title: 'Algorithm',
              alignRight: true,
              skeletonWidth: 75,
              Component: ({ data }) => {
                return <>{data.algorithm}</>;
              },
            },
            {
              title: 'Hashrate',
              skeletonWidth: 80,
              alignRight: true,
              Component: ({ data }) => {
                return <>{formatSi(data.hashrate, 'H/s')}</>;
              },
            },
            {
              title: 'Miners',
              alignRight: true,
              skeletonWidth: 50,
              Component: ({ data }) => {
                return <>{data.minerCount}</>;
              },
            },
            {
              title: '',
              alignRight: true,
              skeletonWidth: 80,
              Component: ({ data }) => {
                return (
                  <Button size="xs" variant="primary">
                    Mine
                  </Button>
                );
              },
            },
          ]}
          data={poolCoinsState.data}
        />
      </Content>
    </Wrapper>
  );
};
