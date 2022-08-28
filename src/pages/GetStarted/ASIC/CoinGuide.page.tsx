import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';

import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import { PingTestSection } from './../GPU/PingTest.section';
import { SetWalletSection } from './../GPU/SetWallet.section';
import { SetWorkerNameSection } from './../GPU/SetWorkerName.section';
import { ViewDashboardSection } from './../GPU/ViewDashboard.section';
import merge from 'lodash.merge';
import { NextSeo } from 'next-seo';
import qs from 'query-string';

import { ExampleInterface, ExampleInterfaceWrapper } from './ExampleInterface';

export const MineableCoinGuidePage: React.FC = () => {
  const router = useRouter();
  const ticker = router.query.ticker;
  const { t, i18n } = useTranslation('get-started');
  const { t: seoT } = useTranslation('seo');

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
    return null;
  }

  const seoTitle = seoT('title.get_started_gpu', {
    coinName: mineableCoin.name,
    coinTicker: mineableCoin.ticker.toUpperCase(),
  });

  const seoDescription = seoT('website_description.get_started_gpu', {
    coinName: mineableCoin.name,
    coinTicker: mineableCoin.ticker.toUpperCase(),
    coinAlgorithm: mineableCoin.algorithm,
  });

  const {
    primaryServer = t('cmd_keys.CLOSEST_SERVER'),
    secondaryServer = t('cmd_keys.CLOSEST_SERVER'),
    walletAddress = t('cmd_keys.WALLET_ADDRESS'),
    workerName = t('cmd_keys.WORKER_NAME'),
  } = qs.parse(typeof window !== 'undefined' ? window.location.search : '');

  return (
    <Page>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        openGraph={{
          title: seoTitle,
          description: seoDescription,
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.get_started_gpu', {
              coinName: mineableCoin.name,
              coinTicker: mineableCoin.ticker.toUpperCase(),
              coinAlgorithm: mineableCoin.algorithm,
            }),
          },
        ]}
      />
      <h1>{t(`detail_${mineableCoin?.ticker}.title`)}</h1>
      <SetWalletSection data={mineableCoin} />
      <Spacer size="xl" />
      <PingTestSection
        data={mineableCoin?.regions}
        showAdditionalPorts={false}
        showPorts={false}
      />
      <Spacer size="xl" />
      <SetWorkerNameSection />
      <Spacer size="xl" />
      <ExampleInterfaceWrapper>
        <ProcessedExampleInterface
          poolNum={'1 (Primary)'}
          login={`${walletAddress}.${workerName}`}
          server={primaryServer as string}
        />
        <ProcessedExampleInterface
          poolNum={'2 (Backup)'}
          login={`${walletAddress}.${workerName}`}
          server={secondaryServer as string}
        />
      </ExampleInterfaceWrapper>
      <Spacer size="xl" />
      <ViewDashboardSection ticker={ticker as string} />
    </Page>
  );
};

const ProcessedExampleInterface: React.FC<{
  poolNum: string;
  login: string;
  server: string;
}> = ({ poolNum, login, server }) => {
  var port = 4444;
  if (server === 'sgeetc.gfwroute.co') {
    port = 48607;
  }

  return (
    <ExampleInterface
      poolNum={poolNum}
      login={login}
      url={`stratum+tcp://${server}:${port}`}
    />
  );
};
