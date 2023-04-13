import React from 'react';
import { useRouter } from 'next/router';

import { useTranslation } from 'next-i18next';

import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import { Mono } from 'src/components/Typo/Typo';
import { PingTestSection } from '../ChiaShared/PingTest.section';
import { TerminalCommand } from './TerminalCommand';
import { AlreadyFarmerGuide, NewFarmerGuide } from './Join.section';
import {
  StandardPlotterGuide,
  MadmaxPlotterGuide,
} from './CreatePlots.section';
import { FarmerOptionSelector } from '../ChiaShared/FarmerOptionSelector';
import useIsMounted from '@/hooks/useIsMounted';
import { ButtonGroupField } from '../common/ButtonGroup/ButtonGroupField';
import merge from 'lodash.merge';
import { NextSeo } from 'next-seo';

import { GuideForm, SectionWrapper } from '../common';

export const ChiaCliGuidePage: React.FC = () => {
  const isMounted = useIsMounted();

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
    return mergedHw.find((item) => item.key === 'XCH-CLI');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mineableCoin || !mineableCoinConfig) {
    router.push('/get-started');
    return null;
  }

  const seoTitle = seoT('title.get_started_chia_regular', {
    coinName: mineableCoin?.name,
    coinTicker: mineableCoin?.ticker.toUpperCase(),
    client: 'CLI',
  });

  const seoDescription = seoT('website_description.get_started_chia_regular', {
    coinName: mineableCoin?.name,
    coinTicker: mineableCoin?.ticker.toUpperCase(),
    client: 'CLI',
  });

  if (!isMounted) return null;

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
            content: seoT('keywords.get_started_chia_regular', {
              coinName: mineableCoin?.name,
              coinTicker: mineableCoin?.ticker.toUpperCase(),
              client: 'CLI',
            }),
          },
        ]}
      />
      <GuideForm
        initialValue={{
          primary_server: 'POOL_URL',
          farmer_option: 'new-farmer',
          plotter: 'standard',
        }}
      >
        {({ values: { primary_server, farmer_option, plotter } }) => {
          return (
            <>
              <h1>{t('detail_xch.title_cli')}</h1>

              <SectionWrapper position={1} title={t('detail.region.title')}>
                <p>{t('detail.region.description_chia')}</p>

                <PingTestSection
                  data={mineableCoin.regions}
                  namePrimary="primary_server"
                />
              </SectionWrapper>

              <Spacer size="xl" />

              <FarmerOptionSelector name="farmer_option" />

              {farmer_option === 'new-farmer' && (
                <NewFarmerGuide position={2} primaryServer={primary_server} />
              )}

              {farmer_option === 'already-farmer' && (
                <AlreadyFarmerGuide
                  position={2}
                  primaryServer={primary_server}
                />
              )}

              <Spacer size="xl" />

              <SectionWrapper
                position={3}
                title={t('detail_xch.plotnft_show.title')}
              >
                <p>{t('detail_xch.plotnft_show.desc')}</p>
                <Spacer />
                <p>{t('detail_xch.plotnft_show.show_command')}</p>
                <TerminalCommand
                  cmd={`chia plotnft show`}
                  output={
                    <>
                      {`Choose wallet key:
          1) 3118587270
          2) 2183884896
          3) 1324486352
          Enter a number to pick or q to quit: `}{' '}
                      <b>1</b>
                      {`

          Wallet height: ...
          Sync status: Synced

          Wallet id 2:
          Current state: FARMING_TO_POOL
          Current state from block height: ...
          Launcher ID: 4973f2b459881b08295dff931c26dc0e511ce6fd46948e142ee151b1f97d7f23
          Target address (not for plotting): xch1d00purr0n5ae8hz706rcwge90m09w00wa4v78d9fpawgdhs6p0fsjt6rd8
          Owner public key: 1b434567c4a027e0e737245f3168e6fff86972a40803fd9243e912db192785d8f06f789f18c226c2e2f6331604c79967
          P2 singleton address (pool contract address for plotting): xch1f9el9dze3qdss22al7f3cfkupeg3eehag62gu9pwu9gmr7ta0u3s225yls
          Current pool URL: ${primary_server}
          Current difficulty: 1
          Points balance: 9999
          Relative lock height: 100 blocks
          Payout instructions (pool will pay to this address): xch1egymuhquwg94e8wdkn2gzulghs7sngnmdr4k003j8xqu76dgwhjs9n84mu`}
                    </>
                  }
                />
              </SectionWrapper>

              <h4>{t('detail_xch.plotnft_show.grab_addresses')}</h4>
              <Spacer />
              <p>
                <ul>
                  <li>
                    <Mono>P2 Singleton Address</Mono> -{' '}
                    {t('detail_xch.plotnft_show.plotting_address')}
                  </li>
                  <li>
                    <Mono>Payout instructions</Mono> -{' '}
                    {t('detail_xch.plotnft_show.payout_address')}
                  </li>
                </ul>
              </p>
              <Spacer size="xl" />
              {farmer_option === 'new-farmer' ? (
                <>
                  <ButtonGroupField
                    name="plotter"
                    options={[
                      {
                        key: 'standard',
                        label: t('detail_xch.plotters.standard_plotter'),
                      },
                      {
                        key: 'madmax',
                        label: t('detail_xch.plotters.madmax_plotter'),
                      },
                    ]}
                  />

                  <SectionWrapper
                    position={4}
                    title={t('detail_xch.create_plots.title')}
                  >
                    {plotter === 'standard' && <StandardPlotterGuide />}
                    {plotter === 'madmax' && <MadmaxPlotterGuide />}
                  </SectionWrapper>

                  <Spacer size="xl" />
                </>
              ) : null}

              <SectionWrapper
                position={farmer_option === 'new-farmer' ? 5 : 4}
                title={t('detail_xch.monitor_farm.title')}
              >
                <p>{t('detail_xch.monitor_farm.desc')}</p>
              </SectionWrapper>

              <Spacer size="xl" />
            </>
          );
        }}
      </GuideForm>
    </Page>
  );
};
