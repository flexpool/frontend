// TODO: Remove this TS nocheck
// @ts-nocheck
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';

import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import { MinerCommandSection } from './MinerCommand.section';
import { PingTestSection } from './PingTest.section';
import { SetWalletSection } from './SetWallet.section';
import { SetWorkerNameSection } from './SetWorkerName.section';
import { ViewDashboardSection } from './ViewDashboard.section';
import merge from 'lodash.merge';

export const MineableCoinGuidePage: React.FC = () => {
  const router = useRouter();
  const ticker = router.query.ticker;
  const { t } = useTranslation('get-started');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jsonHw = t(`detail_${ticker}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  const mineableCoinConfig = React.useMemo(() => {
    const mergedHw = merge(mineableCoin?.hardware, jsonHw);
    return mergedHw.find(
      (item) =>
        item.key ===
        router.pathname.substring(router.pathname.lastIndexOf('/') + 1)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mineableCoin || !mineableCoinConfig) {
    if (typeof window !== 'undefined') {
      router.push('/get-started');
    }
    return <></>;
  }

  return (
    <Page>
      <h1>{t(`detail_${mineableCoin?.ticker}.title`)}</h1>
      <SetWalletSection data={mineableCoin} />
      <Spacer size="xl" />
      <PingTestSection data={mineableCoin?.regions} />
      <Spacer size="xl" />
      <SetWorkerNameSection />
      <Spacer size="xl" />
      <MinerCommandSection data={mineableCoinConfig?.miners} />
      <Spacer size="xl" />
      <ViewDashboardSection ticker={ticker} />
    </Page>
  );
};
