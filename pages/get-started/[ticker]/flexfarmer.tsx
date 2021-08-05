import { useMemo } from 'react';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Page } from 'src/components/layout/Page';
import { Content } from 'src/components/layout/Content';
import { MineableCoinHardware, mineableCoins } from 'src/pages/GetStarted/mineableCoinList';
import { Highlight } from 'src/components/Typo/Typo';
import { PingTestSection } from 'src/pages/GetStarted/ChiaShared/PingTest.section';

import GuideList from 'components/guides/GuideList';
import ButtonGroupOSSelector from 'components/guides/ButtonGroupOSSelector';
import FlexfarmerDownloads from 'components/guides/flexfarmer/FlexfarmerDownloads';
import { TerminalCommand } from 'src/pages/GetStarted/ChiaCli/TerminalCommand';
import GuideInput from 'components/GuideInput';

export const GetStartedFlexfarmerPage = ({ ticker }) => {
  const mineableCoin = useMemo(() => {
    return mineableCoins.find((item) => item.ticker === 'xch');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation(['guide-flexfarmer']);

  let payoutAddress;

  const configTemplate = `plot_directories:
      - "/plotdir1"
      - "/plotdir2"
    farmer_secret_key: "0xf61398a76cdbd6ee5d0f31d757ca96c549876b287c0b19becd26e9e2990eae3e"
    launcher_id: "0x2be1162ad1148809bd01c81cea6eba4f9531fd7d330ab8df34404b5a33facd60"
    worker_name: myworker
    region: us-east
    payout_address: ${
      payoutAddress ? payoutAddress : 'xch1fh6f088cxcvqscy4xtxfq7762vhsh9mjcql6m3svfhmlxsc3jd4sd37xdl'
    }`;

  const chiaPloNftOutput = `Wallet height: ...
    Sync status: Synced

    Wallet id 2:
    Current state: FARMING_TO_POOL
    Current state from block height: ...
    Launcher ID: 4973f2b459881b08295dff931c26dc0e511ce6fd46948e142ee151b1f97d7f23
    Target address (not for plotting): xch1d00purr0n5ae8hz706rcwge90m09w00wa4v78d9fpawgdhs6p0fsjt6rd8
    Owner public key: 1b434567c4a027e0e737245f3168e6fff86972a40803fd9243e912db192785d8f06f789f18c226c2e2f6331604c79967
    P2 singleton address (pool contract address for plotting): xch1f9el9dze3qdss22al7f3cfkupeg3eehag62gu9pwu9gmr7ta0u3s225yls
    Current pool URL: POOL_URL
    Current difficulty: 1
    Points balance: 9999
    Relative lock height: 100 blocks
    Payout instructions (pool will pay to this address): xch1egymuhquwg94e8wdkn2gzulghs7sngnmdr4k003j8xqu76dgwhjs9n84mu`;

  return (
    <Page>
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
      <Content paddingLg>
        <div id="intro" className="mb-5">
          <h1>{t(`title`)}</h1>
          <p>{t(`description`)}</p>
        </div>

        <div id="requirements" className="mb-5">
          <h2>{t('requirements.heading')}</h2>
          <GuideList listItems={t('requirements.list', { returnObjects: true })} />
        </div>

        <div id="install-flexfarmer-cli" className="mb-5">
          <h2>
            <Highlight>#1</Highlight> {t('select_os.heading')}
          </h2>
          <ButtonGroupOSSelector />
        </div>

        <div id="install-flexfarmer-cli" className="mb-5">
          <h2>
            <Highlight>#2</Highlight> Install Flexfarmer CLI
          </h2>
          <FlexfarmerDownloads />
        </div>

        <div id="extract-farmer-secret-key">
          <h2>
            <Highlight>#3</Highlight> {t('farmer_secret_key.heading')}
          </h2>
          <p className="mb-5">{t('farmer_secret_key.description')}</p>

          <TerminalCommand cmd={`python3 extract_farmer_key.py `} output={`Enter your mnemonic > `} className="mb-5" />
          <GuideInput
            className="mb-5"
            label={t('farmer_secret_key.input_label')}
            placeholderText={`0xf61398a76cdbd6ee5d0f31d757ca96c549876b287c0b19becd26e9e2990eae3e`}
            param={`farmerSecretKey`}
          />
        </div>
        <div id="copy-launch-id">
          <h2>
            <Highlight>#3</Highlight> {t('launcher_id.heading')}
          </h2>
          <p className="mb-5">{t('launcher_id.description')}</p>

          <TerminalCommand cmd={`chia plotnft show `} output={chiaPloNftOutput} className="mb-5" />
          <GuideInput
            className="mb-5"
            label={t('launcher_id.input_label')}
            placeholderText={`0x2be1162ad1148809bd01c81cea6eba4f9531fd7d330ab8df34404b5a33facd60`}
            param={`launcherID`}
          />
        </div>

        <h2>
          <Highlight>#</Highlight> Select Your Region
        </h2>
        <p className="mb-5">{t('detail.region.description_chia')}</p>
        <PingTestSection data={mineableCoin.regions} className="mt-2" />
        <h2>
          <Highlight>#</Highlight> Select Your Region
        </h2>
        <h2>
          <Highlight>#</Highlight> Setup Config
        </h2>
        <TerminalCommand cmd={configTemplate} />
      </Content>
    </Page>
  );
};

export default GetStartedFlexfarmerPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'guide-flexfarmer', 'get-started', 'cookie-consent'])),
      ticker: 'xch',
    },
  };
}

export const getStaticPaths = ({ locales }) => {
  const paths = [];

  for (const locale of locales) {
    paths.push({ params: { ticker: 'xch', hw: 'flexfarmer' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
