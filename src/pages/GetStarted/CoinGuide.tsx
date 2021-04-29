import React from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';

import { MineableCoinHardware, mineableCoins } from './mineableCoinList';
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

  const { t } = useTranslation('get-started');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  const poolHw = t(`detail_${ticker}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  const mineableCoinConfig = React.useMemo(() => {
    return poolHw.find((item) => item.key === hw);
  }, [poolHw, hw]);

  if (!mineableCoin || !mineableCoinConfig) {
    return <Redirect to="/get-started" />;
  }

  return (
    <Page>
      <h1>{t(`detail_${mineableCoin.ticker}.title`)}</h1>
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
