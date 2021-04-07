import React from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaCalculator,
  FaNewspaper,
} from 'react-icons/fa';
import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import Modal from 'src/components/Modal/Modal';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { CoinNews } from 'src/sections/CoinNews';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import { useCounterValue } from 'src/utils/currencyValue';
import { fetchApi } from 'src/utils/fetchApi';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components/macro';
import { Link, useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { CoinAbout } from 'src/sections/CoinAbout';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import { CoinCalculator } from 'src/sections/CoinCalculator';
import { CardGrid } from 'src/components/layout/Card';
import { CoinLogo } from 'src/components/CoinLogo';
const ActionIconContainer = styled.div`
  display: inline-flex;
  & > * {
    margin: 0;
    margin-left: 0.3rem;
  }
`;
const ActionIcon = styled(Button)`
  width: 32px;
  padding: 0;
  justify-content: center;
`;

const Wrapper = styled.div`
  padding-top: 5rem;
  padding-bottom: 5rem;

  h2 {
    font-size: 2rem;
  }
`;

const CoinName = styled(Link)`
  color: var(--text-primary);
  display: flex;
  align-items: center;
  & > * {
    margin-right: 0.5rem;
  }
`;

const TickerName = styled.span`
  color: var(--text-tertiary);
`;

const PriceChange = styled.span<{ direction: 'up' | 'down' }>`
  svg {
    height: 14px;
    width: 10px;
    margin-right: 0.25rem;
  }
  ${(p) => {
    switch (p.direction) {
      case 'up':
        return `
        color: var(--danger);
      `;
      case 'down':
        return `
        color: var(--success);
      `;
    }
  }}
`;

const ModalNews: React.FC<{ data?: ApiPoolCoinFull[] | null }> = ({ data }) => {
  const location = useLocation();
  const history = useHistory();
  const { news: newsQueryParam, ...restSearch } = qs.parse(location.search);

  const openedCoin = data?.find((item) => item.ticker === newsQueryParam);

  const handleClose = React.useCallback(() => {
    history.push({
      search: qs.stringify(restSearch),
    });
  }, [restSearch, history]);

  return (
    <Modal size="xl" isOpen={!!openedCoin} handleClose={handleClose} mobileFull>
      <ScrollArea>
        <Modal.Body>
          <CardGrid>
            <CoinAbout data={openedCoin} />
            {openedCoin && <CoinCalculator coin={openedCoin} />}
          </CardGrid>
          <h2>Featured stories</h2>
          <CoinNews coinTicker="eth" />
        </Modal.Body>
      </ScrollArea>
    </Modal>
  );
};

const cols: DynamicListColumn<ApiPoolCoinFull>[] = [
  {
    title: 'Name',
    skeletonWidth: 110,
    Component: ({ data }) => {
      return (
        <CoinName to={{ search: `news=${data.ticker}` }}>
          <CoinLogo size="lg" ticker={data.ticker} />
          <span>{data.name}</span>
          <TickerName>{data.ticker.toUpperCase()}</TickerName>
        </CoinName>
      );
    },
  },
  {
    title: 'Price',
    alignRight: true,
    skeletonWidth: 80,
    Component: ({ data }) => {
      const priceChange = data.marketData.priceChange;
      const priceChangeDirection = priceChange >= 0 ? 'up' : 'down';
      const v = useCounterValue(data.marketData.prices);
      return (
        <Mono>
          <Ws>
            {v}{' '}
            <PriceChange direction={priceChangeDirection}>
              ({priceChangeDirection ? <FaArrowUp /> : <FaArrowDown />}
              {Math.round(Math.abs(priceChange) * 10) / 10}%)
            </PriceChange>
          </Ws>
        </Mono>
      );
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
      return (
        <Ws>
          <Mono>{formatSi(data.hashrate, 'H/s')}</Mono>
        </Ws>
      );
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
        <ActionIconContainer>
          <ActionIcon
            as={Link}
            to={{ search: `news=${data.ticker}` }}
            size="xs"
            variant="primary"
          >
            <FaNewspaper />
          </ActionIcon>
          <ActionIcon
            as={Link}
            to={{ search: `news=${data.ticker}` }}
            size="xs"
            variant="primary"
          >
            <FaCalculator />
          </ActionIcon>
          <Button
            size="xs"
            variant="primary"
            as={Link}
            to={`/get-started/${data.ticker}`}
          >
            Mine
          </Button>
        </ActionIconContainer>
      );
    },
  },
];

export const CoinsWeMineSection = () => {
  const dataState = useAsyncState<ApiPoolCoinFull[]>('coinsFull');

  React.useEffect(() => {
    dataState.start(fetchApi('/pool/coinsFull'));
  }, []);

  return (
    <Wrapper>
      <ModalNews data={dataState.data} />
      <Content contentCenter>
        <h2>Coins we mine</h2>
        <p>
          Flexpool is a Multi-Coin mining pool, which means that you can mine
          your multiple favorite coins on Flexpool.
        </p>
        <br />
        <DynamicList
          isLoading={dataState.isLoading}
          loadingRowsCount={1}
          data={dataState.data || []}
          columns={cols}
        />
      </Content>
    </Wrapper>
  );
};
