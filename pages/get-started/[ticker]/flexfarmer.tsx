import { useMemo, useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import qs from 'query-string';

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
import { getLocationSearch } from 'utils/url';
import { chiaPlotNFTOutput } from 'components/guides/flexfarmer/text-content';

export const GetStartedFlexfarmerPage = ({ ticker }) => {
  const mineableCoin = useMemo(() => {
    return mineableCoins.find((item) => item.ticker === 'xch');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [urlState, setUrlState] = useState(new Date());
  const [farmerSecretKey, setFarmerSecretKey] = useState('' as string | string[]);
  const [launcherID, setLauncherID] = useState('' as string | string[]);
  const [workerName, setWorkerName] = useState('' as string | string[]);
  const [region, setRegion] = useState('' as string | string[]);
  const [payoutAddress, setPayoutAddress] = useState('' as string | string[]);

  const { t } = useTranslation(['guide-flexfarmer']);

  let configTemplate = `plot_directories:
      - "/plotdir1"
      - "/plotdir2"
    farmer_secret_key: "${farmerSecretKey}"
    launcher_id: "${launcherID}"
    worker_name: ${workerName}
    region: ${region}
    payout_address: ${
      payoutAddress ? payoutAddress : 'xch1fh6f088cxcvqscy4xtxfq7762vhsh9mjcql6m3svfhmlxsc3jd4sd37xdl'
    }`;

  useEffect(() => {
    const parsedSearch = qs.parse(getLocationSearch());

    if (parsedSearch.farmerSecretKey !== farmerSecretKey) {
      setFarmerSecretKey(
        parsedSearch.farmerSecretKey || '0xf61398a76cdbd6ee5d0f31d757ca96c549876b287c0b19becd26e9e2990eae3e'
      );
    }
    if (parsedSearch.launcherID !== launcherID) {
      setLauncherID(parsedSearch.launcherID || '4973f2b459881b08295dff931c26dc0e511ce6fd46948e142ee151b1f97d7f23');
    }
    if (parsedSearch.workerName !== workerName) {
      setWorkerName(parsedSearch.workerName || 'worker');
    }
    const parsedRegion = parsedSearch?.primaryServer?.toString().split('xch-').pop().split('.flexpool')[0];

    if (parsedRegion !== region) {
      setRegion(parsedRegion || 'us-east');
    }
    if (parsedSearch.payoutAddress !== payoutAddress) {
      setPayoutAddress(parsedSearch.payoutAddress || 'xch1fh6f088cxcvqscy4xtxfq7762vhsh9mjcql6m3svfhmlxsc3jd4sd37xdl');
    }
  }, [urlState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (event) {
        setUrlState(new Date());
      });
    }
  }, []);

  return (
    <Page>
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
      <Content paddingLg>
        <div id="intro" className="mb-9">
          <h1 className="mb-8">{t(`title`)}</h1>
          <p>{t(`description`)}</p>
        </div>

        <div id="requirements" className="mb-9">
          <h2>{t('requirements.heading')}</h2>
          <GuideList listItems={t('requirements.list', { returnObjects: true })} />
        </div>

        <div id="install-flexfarmer-cli" className="mb-9">
          <h2>
            <Highlight>#1</Highlight> {t('select_os.heading')}
          </h2>
          <ButtonGroupOSSelector />
        </div>

        <div id="install-flexfarmer-cli" className="mb-9">
          <h2>
            <Highlight>#2</Highlight> Install Flexfarmer CLI
          </h2>
          <FlexfarmerDownloads />
        </div>

        <div id="extract-farmer-secret-key" className="mb-9">
          <h2>
            <Highlight>#3</Highlight> {t('farmer_secret_key.heading')}
          </h2>
          <p className="mb-5">{t('farmer_secret_key.description_extract')}</p>

          <TerminalCommand cmd={`python3 extract_farmer_key.py `} output={`Enter your mnemonic > `} className="mb-5" />

          <p className="mb-5">{t('farmer_secret_key.description_mnemonic')}</p>

          <GuideInput
            className="mb-5"
            label={t('farmer_secret_key.input_label')}
            placeholderText={`0xf61398a76cdbd6ee5d0f31d757ca96c549876b287c0b19becd26e9e2990eae3e`}
            param={`farmerSecretKey`}
          />
        </div>

        <div id="copy-launch-id" className="mb-9">
          <h2>
            <Highlight>#3</Highlight> {t('launcher_id.heading')}
          </h2>
          <p className="mb-5">{t('launcher_id.description')}</p>

          <TerminalCommand cmd={`chia plotnft show `} output={chiaPlotNFTOutput} className="mb-5" />

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
