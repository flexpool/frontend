import React from 'react';
import { useRouteMatch } from 'react-router';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { MinerPaymentsList } from './MinerPayments.list';
import PaymentsChart from './Payments.chart';
import { GeneralPaymentStatsSection } from './PaymentStats.section';

export const MinerPaymentsPage = () => {
  const {
    params: { address, coin },
  } = useRouteMatch<{ address: string; coin: string }>();

  const coinData = useActiveCoin(coin);

  return (
    <>
      <Spacer />
      <PaymentsChart address={address} coin={coinData} />
      <GeneralPaymentStatsSection address={address} coin={coinData} />
      <MinerPaymentsList address={address} coin={coinData} />
    </>
  );
};
