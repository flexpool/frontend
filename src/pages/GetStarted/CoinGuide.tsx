import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';

import { mineableCoins } from './mineableCoinList';
import { MinerCommandSection } from './MinerCommand.section';
import { PingTestSection } from './PingTest.section';
import { SetWalletSection } from './SetWallet.section';
import { SetWorkerNameSection } from './SetWorkerName.section';
import { ViewDashboardSection } from './ViewDashboard.section';

export const MineableCoinGuidePage: React.FC = () => {
  const {
    params: { ticker, hw },
  } = useRouteMatch<{
    ticker?: string;
    hw?: string;
  }>();

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  const mineableCoinConfig = React.useMemo(() => {
    return mineableCoin?.hardware.find((item) => item.key === hw);
  }, [mineableCoin, hw]);

  if (!mineableCoin || !mineableCoinConfig) {
    return <Redirect to="/get-started" />;
  }

  return (
    <Page>
      <h1>{mineableCoin.name} mining</h1>
      <SetWalletSection data={mineableCoin} />
      <Spacer size="xl" />
      <PingTestSection data={mineableCoin.regions} />
      <Spacer size="xl" />
      <SetWorkerNameSection />
      <Spacer size="xl" />
      <MinerCommandSection data={mineableCoinConfig.miners} />
      <Spacer size="xl" />
      <ViewDashboardSection ticker={ticker} />
    </Page>
  );
};
