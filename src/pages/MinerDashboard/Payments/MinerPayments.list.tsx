import { format } from 'date-fns';
import React from 'react';
import { useDispatch } from 'react-redux';
import DynamicList from 'src/components/layout/List/List';
import { LinkOutCoin } from 'src/components/LinkOut';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { minerPaymentsGet } from 'src/rdx/minerPayments/minerPayments.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { dateUtils } from 'src/utils/date.utils';

export const MinerPaymentsList: React.FC<{
  address: string;
  coin?: ApiPoolCoin;
}> = ({ coin, address }) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const d = useDispatch();
  const minerPayments = useReduxState('minerPayments');
  const counterTicker = useCounterTicker();

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

  return (
    <>
      <h2>Payments</h2>
      <DynamicList
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
            title: 'Date',
            Component: ({ data }) => {
              return <Ws>{format(data.timestamp * 1000, 'PPp')}</Ws>;
            },
          },
          {
            title: 'Transaction Value',
            alignRight: true,
            Component: ({ data }) => {
              const value = useActiveCoinTickerDisplayValue(data.value);
              const tickerValue = coin
                ? (data.value / Math.pow(10, coin.decimalPlaces)) *
                  counterValuePrice
                : null;

              const tickerDisplayValue = getDisplayCounterTickerValue(
                tickerValue,
                counterTicker
              );

              //  * (minerPayments.data?.countervalue || 1)
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
            title: 'Fee',
            alignRight: true,
            Component: ({ data }) => {
              return (
                <Ws>
                  <Mono>
                    {Math.round(data.feePercent * 100 * 100) / 100}% (
                    {coin &&
                      getDisplayCounterTickerValue(
                        (data.fee / Math.pow(10, coin.decimalPlaces)) *
                          counterValuePrice,
                        counterTicker
                      )}
                    )
                  </Mono>
                </Ws>
              );
            },
          },
          {
            title: 'Duration',
            alignRight: true,
            Component: ({ data }) => {
              return <Ws>{dateUtils.durationWords(data.duration)}</Ws>;
            },
          },
          {
            title: 'Hash',
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
