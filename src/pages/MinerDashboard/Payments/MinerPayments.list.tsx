import { format } from 'date-fns';
import React from 'react';
import { useDispatch } from 'react-redux';
import DynamicList from 'src/components/layout/List/List';
import { Ws } from 'src/components/Typo/Typo';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { minerPaymentsGet } from 'src/rdx/minerPayments/minerPayments.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';

export const MinerPaymentsList: React.FC<{
  address: string;
  coin?: ApiPoolCoin;
}> = ({ coin, address }) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const d = useDispatch();
  const minerPayments = useReduxState('minerPayments');
  const counterTicker = useCounterTicker();

  React.useEffect(() => {
    if (coin) {
      d(minerPaymentsGet(coin?.ticker, address, counterTicker, currentPage));
    }
  }, [coin, address, counterTicker, currentPage, d]);

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

  return (
    <>
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
                <>
                  #
                  {(totalItems % 10) -
                    index +
                    (totalPages - (currentPage + 1)) * 10}
                </>
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
            title: 'Reward',
            Component: ({ data }) => {
              const value = useActiveCoinTickerDisplayValue(data.value);
              return (
                <Ws>
                  {value}
                  <span className="reward">
                    {/* {`(${countervalue.formatter(
                (item.value / Math.pow(10, coin.decimalPlaces)) *
                  countervaluePrice
              )})`} */}
                  </span>
                </Ws>
              );
            },
          },
        ]}
      />
    </>
  );
};
