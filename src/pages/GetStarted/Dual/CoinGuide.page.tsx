import React from 'react';
import { useRouter } from 'next/router';
import { MineableCoinHardware } from '../mineableCoinList';
import { useTranslation } from 'next-i18next';
import { Page } from 'src/components/layout/Page';
import GuideForm from '../common/GuideForm';
import merge from 'lodash.merge';
import {
  ConfigOptions,
  MinerCommandSection,
  SetWalletSectionDual,
  SetWorkerNameSection,
} from '../common';
import {
  findMinableCoinByTicker,
  findMinableCoinHardwareByKey,
} from '../mineableCoinList.utils';
import { NextSeo } from 'next-seo';

type Coin = { name: string; ticker: string };

type MiningConfig = {
  key: string;
  label: string;
  coins: [Coin, Coin];
};

type Props = {
  configs: MiningConfig[];
};

/**
 * This is a standard coin guide page for _dual_ mining
 * This guide assumes:
 * 1. both coins only have 1 server, thus no PingTestSection
 */
export const MinableCoinGuidePage = ({ configs }: Props) => {
  const router = useRouter();
  const ticker = router.query.ticker;

  const { t, i18n } = useTranslation('get-started');
  const { t: seoT } = useTranslation('seo');

  const mineableCoin = findMinableCoinByTicker(ticker as string);

  const minableHardware = findMinableCoinHardwareByKey(
    ticker as string,
    'dual'
  );

  const jsonHw = t(`detail_${ticker}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  // this merges hardware descriptions (such as miner descriptions)
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

      <h1>{t(`detail_${ticker}.title`)}</h1>

      <GuideForm
        initialValue={{
          config: configs[0].key,
          worker_name: '',
          main_wallet_address: '',
          dual_wallet_address: '',
        }}
      >
        {({ values }) => {
          const currentConfig = configs.find(
            (config) => config.key === values.config
          );

          if (!currentConfig)
            return <div>This configuration does not exist.</div>;

          const minableCoin_main = findMinableCoinByTicker(
            currentConfig.coins[0].ticker
          );

          const minableCoin_dual = findMinableCoinByTicker(
            currentConfig.coins[1].ticker
          );

          if (!minableCoin_main || !minableCoin_dual)
            return <div>This coin does not exist.</div>;

          return (
            <>
              <ConfigOptions name="config" options={configs} />
              <SetWorkerNameSection name="worker_name" position={2} />
              <SetWalletSectionDual
                position={3}
                coinMain={minableCoin_main}
                coinDual={minableCoin_dual}
                nameMain="main_wallet_address"
                nameDual="dual_wallet_address"
              />

              {minableHardware && (
                <MinerCommandSection
                  position={4}
                  data={minableHardware.miners}
                  replaces={{
                    MAIN_WALLET_ADDRESS:
                      values.main_wallet_address || 'MAIN_WALLET_ADDRESS',
                    DUAL_WALLET_ADDRESS:
                      values.dual_wallet_address || 'DUAL_WALLET_ADDRESS',
                    WORKER_NAME: values.worker_name || 'WORKER_NAME',
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
