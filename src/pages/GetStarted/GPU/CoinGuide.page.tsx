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
  MinerCommandSection,
  SetWorkerNameSection,
  ViewDashboardSection,
  SetWalletSection,
} from '../common';
import { Spacer } from '@/components/layout/Spacer';

export const MineableCoinGuidePage = () => {
  const router = useRouter();
  const ticker = router.query.ticker;
  const { t, i18n } = useTranslation('get-started');
  const { t: seoT } = useTranslation('seo');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Better to put hardware details in one place
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

              <Spacer />

              <PingTestSection
                position={2}
                data={mineableCoin.regions}
                namePrimary="primary_server"
                nameSecondary="secondary_server"
                showAdditionalPorts
              />

              <SetWorkerNameSection position={3} name="worker_name" />

              <MinerCommandSection
                position={4}
                data={mineableCoinConfig.miners}
                replaces={{
                  CLOSEST_SERVER: values.primary_server || 'CLOSEST_SERVER',
                  BACKUP_SERVER: values.secondary_server || 'BACKUP_SERVER',
                  WALLET_ADDRESS: values.wallet_address || 'WALLET_ADDRESS',
                  WORKER_NAME: values.worker_name || 'WORKER_NAME',
                }}
              />

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
