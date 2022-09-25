import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { Highlight } from 'src/components/Typo/Typo';

import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
// import { PingTestSection } from './../GPU/PingTest.section';
// import { SetWalletSection } from './../GPU/SetWallet.section';
// import { SetWorkerNameSection } from './../GPU/SetWorkerName.section';
// import { ViewDashboardSection } from './../GPU/ViewDashboard.section';
import merge from 'lodash.merge';
import { NextSeo } from 'next-seo';
import qs from 'query-string';

import {
  GuideForm,
  PingTestSection,
  MinerCommandSection,
  SetWorkerNameSection,
  ViewDashboardSection,
  SetWalletSection,
  SectionWrapper,
} from '../common';

import { ExampleInterface, ExampleInterfaceWrapper } from './ExampleInterface';

export const MineableCoinGuidePage: React.FC = () => {
  const router = useRouter();
  const ticker = router.query.ticker;
  const { t, i18n } = useTranslation('get-started');
  const { t: seoT } = useTranslation('seo');

  const [urlState, setUrlState] = useState(new Date());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        setUrlState(new Date());
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

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
      <GuideForm
        initialValue={{
          wallet_address: '',
          primary_server: '',
          secondary_server: '',
          worker_name: '',
        }}
      >
        {({ values }) => {
          return (
            <>
              <SetWalletSection data={mineableCoin} name="wallet_address" />

              <PingTestSection
                data={mineableCoin.regions}
                namePrimary="primary_server"
                nameSecondary="secondary_server"
                showAdditionalPorts={false}
                showPorts={false}
              />

              <SetWorkerNameSection name="worker_name" />

              <SectionWrapper title={t('detail.asic.title')}>
                <p>{t('detail.asic.description')}</p>
                <ExampleInterfaceWrapper>
                  <ProcessedExampleInterface
                    poolNum={'1 (Primary)'}
                    login={`${
                      values.wallet_address || t('cmd_keys.WALLET_ADDRESS')
                    }.${values.worker_name || t('cmd_keys.WORKER_NAME')}`}
                    server={values.primary_server as string}
                  />
                  <ProcessedExampleInterface
                    poolNum={'2 (Backup)'}
                    login={`${
                      values.wallet_address || t('cmd_keys.WALLET_ADDRESS')
                    }.${values.worker_name || t('cmd_keys.WORKER_NAME')}`}
                    server={values.primary_server as string}
                  />
                </ExampleInterfaceWrapper>
              </SectionWrapper>
            </>
          );
        }}
      </GuideForm>
      {/* <SetWalletSection data={mineableCoin} />
      <Spacer size="xl" />
      <PingTestSection
        data={mineableCoin?.regions}
        showAdditionalPorts={false}
        showPorts={false}
      />
      <Spacer size="xl" />
      <SetWorkerNameSection />
      <Spacer size="xl" />
      <h2>
        <Highlight>#4</Highlight> {t('detail.asic.title')}
      </h2>
      <p>{t('detail.asic.description')}</p>
      <Spacer />
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
      <ViewDashboardSection ticker={ticker as string} /> */}
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
