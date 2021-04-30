import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Button } from 'src/components/Button';
import DynamicList from 'src/components/layout/List/List';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOutCoin } from 'src/components/LinkOut';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { minerPaymentsGet } from 'src/rdx/minerPayments/minerPayments.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiMinerPayment } from 'src/types/Miner.types';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { getCoinLink } from 'src/utils/coinLinks.utils';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import styled from 'styled-components';

const HeaderSplit = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const MinerPaymentsList: React.FC<{
  address: string;
  coin?: ApiPoolCoin;
}> = ({ coin, address }) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const d = useDispatch();
  const minerPayments = useReduxState('minerPayments');
  const counterTicker = useCounterTicker();
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const numberFormatter = useLocalizedNumberFormatter();
  const { push } = useHistory();

  React.useEffect(() => {
    if (coin?.ticker) {
      d(minerPaymentsGet(coin.ticker, address, counterTicker, currentPage));
    }
  }, [coin?.ticker, address, counterTicker, currentPage, d]);

  const paymentsData = React.useMemo(() => {
    return minerPayments.data?.data || [];
  }, [minerPayments.data]);

  const { totalItems, totalPages } = React.useMemo(() => {
    return {
      totalItems: 0,
      totalPages: 0,
      ...minerPayments.data,
    };
  }, [minerPayments.data]);

  const counterValuePrice = minerPayments.data?.countervalue || 1;

  const { t } = useTranslation('dashboard');
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const dateFormatter = useLocalizedDateFormatter();
  const handleRowClick = React.useCallback(
    (data: ApiMinerPayment) => {
      window.open(
        getCoinLink('transaction', data.hash, coin?.ticker),
        '_blank'
      );
    },
    [coin?.ticker]
  );

  return (
    <>
      <Spacer size="lg" />
      <HeaderSplit>
        <div>
          <h2>{t('payments.table.title')}</h2>
        </div>
        <Button
          size="xs"
          as="a"
          className="export-button"
          href={`${process.env.REACT_APP_API_URL}/miner/export/payments.csv?coin=${coin?.ticker}&address=${address}&countervalue=${counterTicker}`}
        >
          {t('payments.table.download')}
        </Button>
      </HeaderSplit>
      <DynamicList
        onRowClick={handleRowClick}
        pagination={{
          currentPage,
          setCurrentPage,
          totalPages,
        }}
        data={paymentsData}
        columns={[
          {
            title: '#',
            Component: ({ data, index }) => {
              return (
                <Mono>
                  #
                  {(totalItems % 10) -
                    index +
                    (totalPages - (currentPage + 1)) * 10}
                </Mono>
              );
            },
          },
          {
            title: t('payments.table.table_head.date'),
            Component: ({ data }) => {
              return (
                <Ws>{dateFormatter.dateAndTime(data.timestamp * 1000)}</Ws>
              );
            },
          },
          {
            title: t('payments.table.table_head.value'),
            alignRight: true,
            Component: ({ data }) => {
              const value = activeCoinFormatter(data.value);
              const tickerValue = coin
                ? (data.value / Math.pow(10, coin.decimalPlaces)) *
                  counterValuePrice
                : null;

              const tickerDisplayValue = currencyFormatter(tickerValue || 0);

              return (
                <Ws>
                  <Mono>
                    {value} ({tickerDisplayValue})
                    <span className="reward"></span>
                  </Mono>
                </Ws>
              );
            },
          },
          {
            title: t('payments.table.table_head.fee'),
            alignRight: true,
            Component: ({ data }) => {
              return (
                <Ws>
                  <Mono>
                    {numberFormatter(data.feePercent, {
                      style: 'percent',
                      maximumFractionDigits: 3,
                    })}{' '}
                    (
                    {coin &&
                      currencyFormatter(
                        (data.fee / Math.pow(10, coin.decimalPlaces)) *
                          counterValuePrice
                      )}
                    )
                  </Mono>
                </Ws>
              );
            },
          },
          {
            title: t('payments.table.table_head.duration'),
            alignRight: true,
            Component: ({ data }) => {
              return <Ws>{dateFormatter.durationWords(data.duration)}</Ws>;
            },
          },
          {
            title: t('payments.table.table_head.hash'),
            alignRight: true,
            Component: ({ data }) => {
              return (
                <Ws>
                  <Mono>
                    <LinkOutCoin
                      type="transaction"
                      hash={data.hash}
                      coin={coin?.ticker}
                    />
                  </Mono>
                </Ws>
              );
            },
          },
        ]}
      />
    </>
  );
};
