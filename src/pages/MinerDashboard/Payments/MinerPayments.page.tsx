// import { Helmet } from 'react-helmet-async';
// import { useRouteMatch } from 'react-router';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import PaymentsChart from './Payments.chart';
import { GeneralPaymentStatsSection } from './PaymentStats.section';

export const MinerPaymentsPage: React.FC<{
  address: string;
  coin: string;
}> = ({ address, coin }) => {
  const coinData = useActiveCoin(coin);

  return (
    <>
      {/* <Helmet>
        <title>Miner Payments</title>
      </Helmet> */}
      <PaymentsChart address={address} coin={coinData} />
      <GeneralPaymentStatsSection address={address} coin={coinData} />
    </>
  );
};
