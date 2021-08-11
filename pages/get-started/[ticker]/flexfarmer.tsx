import React, { useMemo, useEffect, useState, ReactNode } from 'react';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import qs from 'query-string';

import { Page } from 'src/components/layout/Page';
import { Content } from 'src/components/layout/Content';
import { MineableCoinRegion, mineableCoins } from 'src/pages/GetStarted/mineableCoinList';
import { Highlight } from 'src/components/Typo/Typo';
import { PingTestSection } from 'src/pages/GetStarted/ChiaShared/PingTest.section';

import GuideList from 'components/guides/GuideList';
import ButtonGroupOSSelector from 'components/guides/ButtonGroupOSSelector';
import { ButtonGroupFarmerSkExtractionMethodSelector } from 'components/guides/flexfarmer/ButtonGroupFarmerSkExtractionMethodSelector';
import { FlexfarmerDownloads } from 'components/guides/flexfarmer/FlexfarmerDownloads';
import { TerminalCommand } from 'src/pages/GetStarted/ChiaCli/TerminalCommand';
import GuideInput from 'components/GuideInput';
import { getLocationSearch } from 'utils/url';
import { chiaPlotNFTOutput } from 'components/guides/flexfarmer/text-content';
import { Code } from 'src/components/Code/Code';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { FarmerSkExtractor } from 'components/guides/flexfarmer/FarmerSkExtractor';

export const GetStartedFlexfarmerPage = ({ ticker }) => {
  const mineableCoin = useMemo(() => {
    return mineableCoins.find((item) => item.ticker === 'xch');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [urlState, setUrlState] = useState(new Date());
  const [farmerSecretKey, setFarmerSecretKey] = useState('');
  const [launcherID, setLauncherID] = useState('');
  const [farmerSkExtractionMethod, setFarmerSkExtractionMethod] = useState('');
  const [workerName, setWorkerName] = useState('' as string | string[]);
  const [region, setRegion] = useState('' as string | string[]);
  const [payoutAddress, setPayoutAddress] = useState('' as string | string[]);

  const { t: localT } = useTranslation('guide-flexfarmer');
  const { t: globalT } = useTranslation('get-started');

  const configTemplate = `plot_directories: # Directories (folder paths) where plots are located
      - "/plotdir1"
      - "/plotdir2"
    farmer_secret_key: "${farmerSecretKey}" # Used to sign partials and blocks
    launcher_id: "${launcherID}" # Identifier of your Plot NFT
    worker_name: "${workerName}" # Arbitrary name that will be shown on your Dashboard
    region: "${region}" # The primary region FlexFarmer will connect to by dafault
    payout_address: "${payoutAddress}" # Address to where all rewards will go`;

  useEffect(() => {
    const parsedSearch = qs.parse(getLocationSearch());
    const parsedRegionTmp = parsedSearch?.primaryServer?.toString().split('xch-').pop();

    if (!parsedRegionTmp) {
      return;
    }

    const parsedRegion = parsedRegionTmp.split('.flexpool')[0];

    if (parsedSearch.launcherID !== launcherID) {
      setLauncherID((parsedSearch.launcherID as string) || 'LAUNCHER_ID');
    }
    if (parsedSearch.workerName !== workerName) {
      setWorkerName(parsedSearch.workerName || 'WORKER_NAME');
    }
    if (parsedRegion !== region) {
      setRegion(parsedRegion || 'REGION');
    }
    if (parsedSearch.payoutAddress !== payoutAddress) {
      setPayoutAddress(parsedSearch.payoutAddress || 'PAYOUT_ADDRESS');
    }
    if (parsedSearch.farmerSkExtractionMethod !== farmerSkExtractionMethod) {
      setFarmerSkExtractionMethod(
        (parsedSearch.farmerSkExtractionMethod as string) || 'browser'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (event) {
        setUrlState(new Date());
      });
    }
  }, []);

  const versionState = useAsyncState<Response>();
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  React.useEffect(() => {
    versionState
      .start(fetch('https://static.flexpool.io/dl/flexfarmer/version'))
      .then((res) => {
        res.text().then((text) => {
          setLatestVersion(text);
        });
        return res;
      });
    // eslint-disable-next-line
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
          <h1 className="mb-8">{localT(`title`)}</h1>
          <p>{localT(`description`)}</p>
        </div>

        <div id="requirements" className="mb-9">
          <h2>{localT('requirements.heading')}</h2>
          <GuideList listItems={localT('requirements.list', { returnObjects: true })} />
        </div>

        <div id="install-flexfarmer-cli" className="mb-9">
          <h2>
            <Highlight>#1</Highlight> {localT('select_os.heading')}
          </h2>
          <ButtonGroupOSSelector />
        </div>

        <div id="install-flexfarmer-cli" className="mb-9">
          <h2>
            <Highlight>#2</Highlight> Install Flexfarmer CLI
          </h2>
          <FlexfarmerDownloads version={latestVersion as string} />
        </div>

        <div id="extract-farmer-secret-key" className="mb-9">
          <h2>
            <Highlight>#3</Highlight> {localT('farmer_secret_key.heading')}
          </h2>
          <p className="mb-5">{localT('farmer_secret_key.description_extract')}</p>

          <ButtonGroupFarmerSkExtractionMethodSelector />
          {farmerSkExtractionMethod}
          <FarmerSkExtractor />

          <TerminalCommand
            cmd={`python3 extract_farmer_key.py `}
            output={`Enter your mnemonic > `}
            className="mb-5"
          />

          <p className="mb-5">{localT('farmer_secret_key.description_mnemonic')}</p>

          <GuideInput
            className="mb-5"
            label={localT('farmer_secret_key.input_label')}
            placeholderText={`0xf61398a76cdbd6ee5d0f31d757ca96c549876b287c0b19becd26e9e2990eae3e`}
            setExternalValue={(value: string) => {
              setFarmerSecretKey(value);
            }}
            regexp={/^(0x)?[A-Fa-f0-9]{64}$/}
          />
        </div>

        <div id="copy-launch-id" className="mb-9">
          <h2>
            <Highlight>#3</Highlight> {localT('launcher_id.heading')}
          </h2>
          <p className="mb-5">{localT('launcher_id.description')}</p>

          <TerminalCommand
            cmd={`chia plotnft show`}
            output={chiaPlotNFTOutput}
            className="mb-5"
          />

          <GuideInput
            className="mb-5"
            label={localT('launcher_id.input_label')}
            placeholderText={`0x2be1162ad1148809bd01c81cea6eba4f9531fd7d330ab8df34404b5a33facd60`}
            setExternalValue={(value: string) => {
              setLauncherID(value);
            }}
            regexp={/^(0x)?[A-Fa-f0-9]{64}$/}
          />
        </div>

        <h2>
          <Highlight>#4</Highlight> {globalT('detail.region.title')}
        </h2>

        <p className="mb-5">{globalT('detail.region.description_chia')}</p>

        <PingTestSection data={mineableCoin?.regions as MineableCoinRegion[]} />

        <h2>
          <Highlight>#</Highlight> {localT('config.heading')}
        </h2>
        <p className="mb-5">{localT('config.description')}</p>

        <Code language="yaml">{configTemplate}</Code>
      </Content>
    </Page>
  );
};

export default GetStartedFlexfarmerPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'guide-flexfarmer',
        'get-started',
        'cookie-consent',
      ])),
      ticker: 'xch',
    },
  };
}

interface Path {
  params: {
    ticker: string;
    hw: string;
  };
  locale: any;
}

export const getStaticPaths = ({ locales }) => {
  const paths: Array<Path> = [];

  for (const locale of locales) {
    paths.push({ params: { ticker: 'xch', hw: 'flexfarmer' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
