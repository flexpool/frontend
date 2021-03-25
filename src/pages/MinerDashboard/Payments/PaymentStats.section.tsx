import React from 'react';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { StatItem } from 'src/components/StatItem';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { fetchApi } from 'src/utils/fetchApi';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { dateUtils } from 'src/utils/date.utils';
import { formatDistance } from 'date-fns';

type ApiPaymentStats = {
  countervalue: number;
  lastPayment: {
    duration: number;
    fee: number;
    feePercent: number;
    hash: string;
    timestamp: number;
    value: number;
  };
  stats: {
    averageDuration: number;
    averageFee: number;
    averageFeePercent: number;
    averageValue: number;
    totalFees: number;
    totalPaid: number;
    transactionCount: number;
  };
};
export const GeneralPaymentStatsSection: React.FC<{
  address: string;
  coin?: ApiPoolCoin;
}> = ({ address, coin }) => {
  const asyncState = useAsyncState<ApiPaymentStats>('paymentStats');
  const couterTicker = useCounterTicker();

  React.useEffect(() => {
    if (coin) {
      asyncState.start(
        fetchApi('/miner/paymentsStats', {
          query: {
            address: address,
            coin: coin.ticker,
            countervalue: couterTicker,
          },
        })
      );
    }
  }, [coin]);

  const data = asyncState.data;
  console.log(data?.stats.totalPaid);
  const totalPaidCounter =
    data && coin
      ? getDisplayCounterTickerValue(
          (data.stats.totalPaid / Math.pow(10, coin.decimalPlaces)) *
            data.countervalue,
          couterTicker
        )
      : undefined;

  const totalPaid = useActiveCoinTickerDisplayValue(
    data?.stats.totalPaid,
    coin
  );

  return (
    <CardGrid>
      <Card padding>
        <CardTitle>Total Paid</CardTitle>
        <StatItem value={totalPaidCounter} subValue={totalPaid} />
      </Card>
      <Card padding>
        <CardTitle>Total Transactions</CardTitle>
        <StatItem
          value={data?.stats.transactionCount}
          subValue={
            data
              ? `${
                  Math.round(
                    (data.stats.totalFees / data.stats.totalPaid) * 100 * 100
                  ) / 100
                }% paid in fees`
              : null
          }
        />
      </Card>
      <Card padding>
        <CardTitle>Average Payout Duration</CardTitle>
        <StatItem
          value={
            data ? formatDistance(0, data.stats.averageDuration * 1000) : 'N/A'
          }
          subValue="Average Time Between Payouts"
        />
      </Card>
    </CardGrid>
  );
};
