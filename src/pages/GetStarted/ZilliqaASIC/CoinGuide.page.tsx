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
  SectionWrapper,
  SetWalletSectionDual,
} from '../common';

import { ViewDashboard } from '../ZilliqaGPU/ViewDashboard';

import { ExampleInterface } from '../ASIC/ExampleInterface';
import { MockBrowser } from '../ASIC/MockBrowser';
import { Spacer } from '@/components/layout/Spacer';
import { findMinableCoinByTicker } from '../mineableCoinList.utils';

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

  const seoTitle = seoT('title.get_started_asic', {
    coinName: mineableCoin.name,
    coinTicker: mineableCoin.ticker.toUpperCase(),
  });

  const seoDescription = seoT('website_description.get_started_asic', {
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
          main_wallet_address: '',
          dual_wallet_address: '',
          primary_server: '',
          secondary_server: '',
          worker_name: '',
          main_coin: 'etc',
        }}
      >
        {({ values }) => {
          // Currently, assume main coin is always etc
          const mainCoin = findMinableCoinByTicker('etc');
          const dualCoin = findMinableCoinByTicker('zil');

          return (
            <>
              {mainCoin && dualCoin && (
                <>
                  <SetWalletSectionDual
                    position={1}
                    coinMain={mainCoin}
                    coinDual={dualCoin}
                    nameMain="main_wallet_address"
                    nameDual="dual_wallet_address"
                  />
                  <PingTestSection
                    position={2}
                    data={mainCoin.regions}
                    namePrimary="primary_server"
                    nameSecondary="secondary_server"
                    showPorts={false}
                  />
                </>
              )}

              <SetWorkerNameSection position={3} name="worker_name" />

              <SectionWrapper position={4} title={t('detail.asic.title')}>
                <p>{t('detail.asic.description')}</p>
                <Spacer />
                <MockBrowser>
                  <ProcessedExampleInterface
                    poolNum={'1 (Primary)'}
                    login={(() => {
                      const etc =
                        values.main_wallet_address ||
                        t('cmd_keys.ETC_WALLET_ADDRESS');

                      const zil =
                        values.dual_wallet_address ||
                        t('cmd_keys.ZIL_WALLET_ADDRESS');

                      const name =
                        values.worker_name || t('cmd_keys.WORKER_NAME');

                      return `${etc}/${zil}.${name}`;
                    })()}
                    server={values.primary_server as string}
                  />
                  <ProcessedExampleInterface
                    poolNum={'2 (Backup)'}
                    login={(() => {
                      const etc =
                        values.main_wallet_address ||
                        t('cmd_keys.ETC_WALLET_ADDRESS');

                      const zil =
                        values.dual_wallet_address ||
                        t('cmd_keys.ZIL_WALLET_ADDRESS');

                      const name =
                        values.worker_name || t('cmd_keys.WORKER_NAME');

                      return `${etc}/${zil}.${name}`;
                    })()}
                    server={values.secondary_server as string}
                  />
                  <Spacer size="lg" />
                </MockBrowser>
              </SectionWrapper>

              {mainCoin &&
                values.main_wallet_address &&
                values.dual_wallet_address && (
                  <ViewDashboard
                    position={5}
                    primary={{
                      coin: mainCoin,
                      address: values.main_wallet_address,
                    }}
                    dual={{
                      coin: mineableCoins[2],
                      address: values.dual_wallet_address,
                    }}
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
