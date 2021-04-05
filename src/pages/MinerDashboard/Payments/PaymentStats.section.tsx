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
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MinerPaymentsList } from './MinerPayments.list';

type ApiPaymentStats = {
  countervalue: number;
  lastPayment: {
    duration: number;
    fee: number;
    feePercent: number;
    hash: string;
    timestamp: number;
    value: number;
  } | null;
  stats: {
    averageDuration: number;
    averageFee: number;
    averageFeePercent: number;
    averageValue: number;
    totalFees: number;
    totalPaid: number;
    transactionCount: number;
  } | null;
};
export const GeneralPaymentStatsSection: React.FC<{
  address: string;
  coin?: ApiPoolCoin;
}> = ({ address, coin }) => {
  const asyncState = useAsyncState<ApiPaymentStats>('paymentStats');
  const couterTicker = useCounterTicker();

  React.useEffect(() => {
    if (coin?.ticker) {
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
  }, [coin?.ticker, address, couterTicker]);

  const data = {
    ...asyncState.data,
    stats:
      asyncState.data?.stats === null
        ? {
            averageDuration: 0,
            averageFee: 0,
            averageFeePercent: 0,
            averageValue: 0,
            totalFees: 0,
            totalPaid: 1,
            transactionCount: 0,
          }
        : asyncState.data?.stats,
  };

  const totalPaidCounter =
    data && data.stats && coin && data.countervalue
      ? getDisplayCounterTickerValue(
          (data.stats.totalPaid / Math.pow(10, coin.decimalPlaces)) *
            data.countervalue,
          couterTicker
        )
      : undefined;

  const totalPaid = useActiveCoinTickerDisplayValue(
    data?.stats?.totalPaid,
    coin
  );

  const averageTransactionFeeCounter =
    data && coin && data.stats && data.countervalue
      ? getDisplayCounterTickerValue(
          (data.stats.averageFee / Math.pow(10, coin.decimalPlaces)) *
            data.countervalue,
          couterTicker
        )
      : undefined;

  const averageTransactionFee = useActiveCoinTickerDisplayValue(
    data?.stats?.averageFee,
    coin,
    10000000
  );

  const lastPaymentCounter =
    data && data.lastPayment && coin && data.countervalue
      ? getDisplayCounterTickerValue(
          (data.lastPayment.value / Math.pow(10, coin.decimalPlaces)) *
            data.countervalue,
          couterTicker
        )
      : undefined;

  const lastPayment = useActiveCoinTickerDisplayValue(
    data?.lastPayment?.value,
    coin
  );

  if (data && !data.lastPayment) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Miner Payments</title>
      </Helmet>
      <h2>General Payment Statistics</h2>
      <CardGrid>
        <Card padding>
          <CardTitle>Total Paid</CardTitle>
          <StatItem value={totalPaidCounter} subValue={totalPaid} />
        </Card>
        <Card padding>
          <CardTitle>Total Transactions</CardTitle>
          <StatItem
            value={data?.stats?.transactionCount}
            subValue={
              data && data.stats
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
              data && data.stats
                ? formatDistance(0, data.stats.averageDuration * 1000)
                : 'N/A'
            }
            subValue="Average Time Between Payouts"
          />
        </Card>
      </CardGrid>
      <h2>Transaction fees</h2>
      <CardGrid>
        <Card padding>
          <CardTitle>Last Transaction</CardTitle>
          <StatItem
            value={lastPaymentCounter}
            subValue={
              data && data.lastPayment ? (
                <>
                  {lastPayment} •{' '}
                  {dateUtils.formatDistance(data.lastPayment.timestamp * 1000)}{' '}
                  •{' '}
                  {Math.round(
                    (data.lastPayment.fee / data.lastPayment.value) * 100 * 100
                  ) / 100}
                  % fee
                </>
              ) : null
            }
          />
        </Card>
        <Card padding>
          <CardTitle>Average Transaction Fee</CardTitle>
          <StatItem
            value={averageTransactionFeeCounter}
            subValue={averageTransactionFee}
          />
        </Card>
        <Card padding>
          <CardTitle>Average Transaction Fee %</CardTitle>
          <StatItem
            value={
              data && data.stats && data.stats.averageFeePercent
                ? `${
                    Math.round(data.stats.averageFeePercent * 100 * 1000) / 1000
                  }%`
                : 'N/A'
            }
            subValue={<Link to="/">Tips on reducing fees</Link>}
          />
        </Card>
      </CardGrid>
      <MinerPaymentsList address={address} coin={coin} />
    </>
  );
};
