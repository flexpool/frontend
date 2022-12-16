import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Page } from 'src/components/layout/Page';
import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import merge from 'lodash.merge';
import { NextSeo } from 'next-seo';

import {
  GuideForm,
  PingTestSection,
  SetWorkerNameSection,
  ViewDashboardSection,
  SetWalletSection,
  SectionWrapper,
} from '../common';

import { ExampleInterface, ExampleInterfaceWrapper } from './ExampleInterface';
import { MockBrowser } from './MockBrowser';
import { Spacer } from '@/components/layout/Spacer';

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
              <SetWalletSection
                position={1}
                data={mineableCoin}
                name="wallet_address"
              />

              <PingTestSection
                position={2}
                data={mineableCoin.regions}
                namePrimary="primary_server"
                nameSecondary="secondary_server"
                showPorts={false}
              />

              <SetWorkerNameSection position={3} name="worker_name" />

              <SectionWrapper position={4} title={t('detail.asic.title')}>
                <p>{t('detail.asic.description')}</p>
                <Spacer />
                <MockBrowser>
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
                    server={values.secondary_server as string}
                  />
                  <Spacer size="lg" />
                </MockBrowser>
              </SectionWrapper>

              {values.wallet_address && (
                <ViewDashboardSection
                  position={5}
                  coin={mineableCoin}
                  address={values.wallet_address}
                />
              )}
            </>
          );
        }}
      </GuideForm>
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
