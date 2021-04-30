import React from 'react';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { StatItem } from 'src/components/StatItem';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { fetchApi } from 'src/utils/fetchApi';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MinerPaymentsList } from './MinerPayments.list';
import { useTranslation } from 'react-i18next';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';

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
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const { t } = useTranslation('dashboard');
  const numberFormatter = useLocalizedNumberFormatter();
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const dateFormatter = useLocalizedDateFormatter();

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
    // eslint-disable-next-line
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
      ? currencyFormatter(
          (data.stats.totalPaid / Math.pow(10, coin.decimalPlaces)) *
            data.countervalue
        )
      : undefined;

  const totalPaid = activeCoinFormatter(data?.stats?.totalPaid);

  const averageTransactionFeeCounter =
    data && coin && data.stats && data.countervalue
      ? currencyFormatter(
          (data.stats.averageFee / Math.pow(10, coin.decimalPlaces)) *
            data.countervalue
        )
      : undefined;

  const averageTransactionFee = activeCoinFormatter(data?.stats?.averageFee, {
    maximumFractionDigits: 8,
  });

  const lastPaymentCounter =
    data && data.lastPayment && coin && data.countervalue
      ? currencyFormatter(
          (data.lastPayment.value / Math.pow(10, coin.decimalPlaces)) *
            data.countervalue
        )
      : undefined;

  const lastPayment = activeCoinFormatter(data?.lastPayment?.value);

  if (data && !data.lastPayment) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{t('payments.head_title')}</title>
      </Helmet>
      <h2>{t('payments.general.title')}</h2>
      <CardGrid>
        <Card padding>
          <CardTitle>{t('payments.general.total_paid')}</CardTitle>
          <StatItem value={totalPaidCounter} subValue={totalPaid} />
        </Card>
        <Card padding>
          <CardTitle>{t('payments.general.total_transactions')}</CardTitle>
          <StatItem
            value={data?.stats?.transactionCount}
            subValue={
              data && data.stats
                ? t('payments.general.paid_in_fees', {
                    value: numberFormatter(
                      data.stats.totalFees / data.stats.totalPaid,
                      {
                        style: 'percent',
                        maximumFractionDigits: 2,
                      }
                    ),
                  })
                : null
            }
          />
        </Card>
        <Card padding>
          <CardTitle>{t('payments.general.average_payout_duration')}</CardTitle>
          <StatItem
            value={
              data && data.stats
                ? dateFormatter.distance(0, data.stats.averageDuration * 1000)
                : 'N/A'
            }
            subValue={t('payments.general.average_payout_duration_desc')}
          />
        </Card>
      </CardGrid>
      <h2>{t('payments.transaction_fees.title')}</h2>
      <CardGrid>
        <Card padding>
          <CardTitle>{t('payments.transaction_fees.last')}</CardTitle>
          <StatItem
            value={lastPaymentCounter}
            subValue={
              data && data.lastPayment ? (
                <>
                  {lastPayment} •{' '}
                  {dateFormatter.distanceFromNow(
                    data.lastPayment.timestamp * 1000
                  )}{' '}
                  •{' '}
                  {t('payments.transaction_fees.fee', {
                    value: numberFormatter(
                      data.lastPayment.fee / data.lastPayment.value,
                      {
                        style: 'percent',
                        maximumFractionDigits: 2,
                      }
                    ),
                  })}
                </>
              ) : null
            }
          />
        </Card>
        <Card padding>
          <CardTitle>{t('payments.transaction_fees.average')}</CardTitle>
          <StatItem
            value={averageTransactionFeeCounter}
            subValue={averageTransactionFee}
          />
        </Card>
        <Card padding>
          <CardTitle>
            {t('payments.transaction_fees.average_percent')}
          </CardTitle>
          <StatItem
            value={
              data && data.stats && data.stats.averageFeePercent
                ? numberFormatter(data.stats.averageFeePercent, {
                    style: 'percent',
                    maximumFractionDigits: 3,
                  })
                : 'N/A'
            }
            subValue={
              <Link to="/">{t('payments.transaction_fees.average_cta')}</Link>
            }
          />
        </Card>
      </CardGrid>
      <MinerPaymentsList address={address} coin={coin} />
    </>
  );
};
