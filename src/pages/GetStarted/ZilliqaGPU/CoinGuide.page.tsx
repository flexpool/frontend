import React from 'react';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { useField } from 'formik';

import { Page } from 'src/components/layout/Page';

import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import merge from 'lodash.merge';
import { NextSeo } from 'next-seo';

import { SetWorkerNameSection } from '../common/SetWorkerNameSection';
import { SetWalletSectionDual } from '../common/SetWalletSectionDual';
import { PingTestSection } from '../common/PingTestSection';
import { MinerCommandSection } from '../common/MinerCommand.section';
import GuideForm from '../common/GuideForm';
import MainCoinButtonGroup from './MainCoinButtonGroup';
import ViewDashboard from './ViewDashboard';

import { SectionWrapper } from '../common/SectionWrapper';
import { InfoBox } from '@/components/InfoBox';
import { Spacer } from '@/components/layout/Spacer';

import styled from 'styled-components';

import { AiOutlineInfoCircle } from 'react-icons/ai';

const CompatibleLink = ({ children }: any) => {
  const [, , { setValue: setMainCoin }] = useField({
    name: 'main_coin',
  });

  return (
    <a
      style={{
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
      onClick={() => {
        setMainCoin('etc_compatible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      {children}
    </a>
  );
};

const MinerInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    flex-shrink: 0;
  }
`;

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

      <h1>{t(`detail_${ticker}.title`)}</h1>

      <GuideForm
        initialValue={{
          worker_name: '',
          main_wallet_address: '',
          dual_wallet_address: '',
          main_primary_server: '',
          main_secondary_server: '',
          dual_primary_server: 'zil.flexpool.io',
          dual_secondary_server: 'zil.flexpool.io',
          main_coin: 'etc',
        }}
      >
        {({ values }) => {
          const isMiningEth = values.main_coin === 'eth';

          let formatCoin = values.main_coin;
          if (formatCoin === 'etc_compatible') formatCoin = 'etc';

          const mainCoin = mineableCoins.find(
            (coin) => coin.ticker === formatCoin
          );

          return (
            <>
              <SectionWrapper
                position={1}
                title={t(`detail_${ticker}.select_dual_mining`)}
              >
                <MainCoinButtonGroup name="main_coin" />
              </SectionWrapper>

              <SetWorkerNameSection position={2} />

              {mainCoin && (
                <>
                  <SetWalletSectionDual
                    position={3}
                    data={mainCoin}
                    nameMain="main_wallet_address"
                    nameDual="dual_wallet_address"
                  />

                  <PingTestSection
                    position={4}
                    data={mainCoin.regions}
                    namePrimary="main_primary_server"
                    nameSecondary="main_secondary_server"
                  />

                  {values.main_coin === 'etc' && (
                    <MinerCommandSection
                      extra={
                        <div
                          style={{
                            width: '80%',
                          }}
                        >
                          <InfoBox variant="primary">
                            <MinerInfoContainer>
                              <AiOutlineInfoCircle size={22} />
                              <div>
                                <div>{t('detail_zil.not_seeing')}</div>
                                <div>
                                  <Trans
                                    t={t}
                                    i18nKey="detail_zil.we_encourage"
                                    components={{
                                      compatible: <CompatibleLink />,
                                    }}
                                  />
                                </div>
                              </div>
                            </MinerInfoContainer>
                          </InfoBox>
                          <Spacer />
                        </div>
                      }
                      position={5}
                      data={mineableCoins[2].hardware[0].miners}
                      replaces={{
                        ALGO: isMiningEth ? 'ethash' : 'etchash',
                        CLOSEST_SERVER:
                          values.main_primary_server || 'PRIMARY_SERVER',
                        BACKUP_SERVER:
                          values.main_secondary_server || 'BACKUP_SERVER',
                        MAIN_WALLET_ADDRESS:
                          values.main_wallet_address || 'MAIN_WALLET_ADDRESS',
                        DUAL_WALLET_ADDRESS:
                          values.dual_wallet_address || 'DUAL_WALLET_ADDRESS',
                        WORKER_NAME: values.worker_name || 'WORKER_NAME',
                      }}
                    />
                  )}

                  {values.main_coin === 'etc_compatible' && (
                    <MinerCommandSection
                      position={5}
                      // Same as ETC but with different login
                      data={mineableCoins[0].hardware[0].miners}
                      replaces={{
                        ALGO: isMiningEth ? 'ethash' : 'etchash',
                        CLOSEST_SERVER:
                          values.main_primary_server || 'PRIMARY_SERVER',
                        BACKUP_SERVER:
                          values.main_secondary_server || 'BACKUP_SERVER',
                        WALLET_ADDRESS: `${
                          values.main_wallet_address || 'ETC_WALLET_ADDRESS'
                        }/${
                          values.dual_wallet_address || 'ZIL_WALLET_ADDRESS'
                        }`,
                        WORKER_NAME: values.worker_name || 'WORKER_NAME',
                      }}
                    />
                  )}

                  {values.main_wallet_address && values.dual_wallet_address && (
                    <ViewDashboard
                      position={6}
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
              )}
            </>
          );
        }}
      </GuideForm>
    </Page>
  );
};
