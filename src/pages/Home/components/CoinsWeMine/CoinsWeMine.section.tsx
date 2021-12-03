/* eslint-disable react/display-name */
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import qs from 'query-string';
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
import {
  ActionIconContainer,
  ActionIcon,
  Wrapper,
  CoinName,
  TickerName,
  PriceChange,
} from './components';
import Modal from 'src/components/Modal/Modal';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { CoinNews } from 'src/sections/CoinNews';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
  useLocalizedSiFormatter,
} from 'src/utils/si.utils';
import { CoinAbout } from 'src/sections/CoinAbout';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import { CoinCalculator } from 'src/sections/CoinCalculator';
import { CardGrid } from 'src/components/layout/Card';
import { CoinLogo } from 'src/components/CoinLogo';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import usePoolCoinsFullQuery from '@/hooks/usePoolCoinsFullQuery';

const ModalNews: React.FC<{ data?: ApiPoolCoinFull[] | null }> = ({ data }) => {
  const router = useRouter();
  const newsQueryParam = router.query.news;
  const openedCoin = data?.find((item) => item.ticker === newsQueryParam);

  const handleClose = React.useCallback(() => {
    router.replace(router.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation('home');

  return (
    <Modal size="xl" isOpen={!!openedCoin} handleClose={handleClose} mobileFull>
      <Modal.Header>
        <h2>{openedCoin?.name}</h2>
      </Modal.Header>
      <ScrollArea>
        <Modal.Body>
          <CardGrid style={{ marginTop: 0 }}>
            <CoinAbout data={openedCoin} />
            {openedCoin && <CoinCalculator coin={openedCoin} />}
          </CardGrid>
          <h2>{t('coin_news_item.featured.title')}</h2>
          {openedCoin?.ticker && <CoinNews coinTicker={openedCoin?.ticker} />}
        </Modal.Body>
      </ScrollArea>
    </Modal>
  );
};

export const CoinsWeMineSection = () => {
  const { data: poolCoinsFull, isLoading } = usePoolCoinsFullQuery();
  const { t } = useTranslation('home');
  const siFormatter = useLocalizedSiFormatter();
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const numberFormatter = useLocalizedNumberFormatter();
  const activeCounterTicker = useCounterTicker();
  const router = useRouter();
  const handleRowClick = React.useCallback(
    (data: ApiPoolCoinFull) => {
      router.push({ search: `news=${data.ticker}` });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const columns: DynamicListColumn<ApiPoolCoinFull>[] = React.useMemo(() => {
    return [
      {
        title: t('mined_coins_section.table_head.name'),
        skeletonWidth: 110,
        Component: ({ data }) => {
          return (
            <Link
              href={{ search: `news=${data.ticker}` }}
              passHref
              scroll={false}
              shallow
            >
              <CoinName aria-label={`${data.ticker} news`}>
                <CoinLogo size="lg" ticker={data.ticker} />
                <span>{data.name}</span>
                <TickerName>{data.ticker.toUpperCase()}</TickerName>
              </CoinName>
            </Link>
          );
        },
      },
      {
        title: t('mined_coins_section.table_head.price'),
        alignRight: true,
        skeletonWidth: 80,
        Component: ({ data }) => {
          const priceChange = data.marketData.priceChange;
          const priceChangeDirection = priceChange >= 0 ? 'up' : 'down';
          const value = data.marketData.prices[activeCounterTicker];

          return (
            <Mono>
              <Ws>
                {currencyFormatter(value)}{' '}
                <PriceChange direction={priceChangeDirection}>
                  (
                  {priceChangeDirection === 'up' ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )}
                  {Math.round(Math.abs(priceChange) * 10) / 10}%)
                </PriceChange>
              </Ws>
            </Mono>
          );
        },
      },
      {
        title: t('mined_coins_section.table_head.market_cap'),
        alignRight: true,
        skeletonWidth: 140,
        Component: ({ data }) => {
          const value = data.marketData.marketCaps[activeCounterTicker];

          return <>{currencyFormatter(value)}</>;
        },
      },
      {
        title: t('mined_coins_section.table_head.algorithm'),
        alignRight: true,
        skeletonWidth: 75,
        Component: ({ data }) => {
          return <>{data.algorithm}</>;
        },
      },
      {
        title: t('mined_coins_section.table_head.hashrate'),
        skeletonWidth: 80,
        alignRight: true,
        Component: ({ data }) => {
          return (
            <Ws>
              <Mono>
                {siFormatter(data.hashrate, { unit: data.hashrateUnit })}
              </Mono>
            </Ws>
          );
        },
      },
      {
        title: t('mined_coins_section.table_head.miners'),
        alignRight: true,
        skeletonWidth: 50,
        Component: ({ data }) => {
          return <>{numberFormatter(data.minerCount)}</>;
        },
      },
      {
        title: null,
        alignRight: true,
        skeletonWidth: 80,
        Component: ({ data }) => {
          return (
            <ActionIconContainer>
              <ActionIcon size="xs" variant="primary">
                <FaNewspaper />
              </ActionIcon>
              <ActionIcon size="xs" variant="primary">
                <FaCalculator />
              </ActionIcon>
              <Link href={`/get-started/${data.ticker}`} passHref>
                <Button
                  size="xs"
                  variant="primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('mined_coins_section.item_cta')}
                </Button>
              </Link>
            </ActionIconContainer>
          );
        },
      },
    ];
  }, [t, siFormatter, currencyFormatter, numberFormatter, activeCounterTicker]);

  return (
    <Wrapper>
      <ModalNews data={poolCoinsFull} />
      <Content contentCenter>
        <h2>{t('mined_coins_section.title')}</h2>
        <p>{t('mined_coins_section.description')}</p>
        <br />
        <DynamicList
          onRowClick={handleRowClick}
          isLoading={isLoading}
          loadingRowsCount={1}
          data={poolCoinsFull || []}
          columns={columns}
        />
      </Content>
    </Wrapper>
  );
};
