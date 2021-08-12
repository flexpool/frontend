import React, { useMemo, useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import { Trans, useTranslation } from 'next-i18next';
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
import { checksumXCH } from 'src/utils/validators/xchWalletAddress.validator';
import { Spacer } from 'src/components/layout/Spacer';

export const GetStartedFlexfarmerPage = ({ ticker }) => {
  const mineableCoin = useMemo(() => {
    return mineableCoins.find((item) => item.ticker === 'xch');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [urlState, setUrlState] = useState(new Date());
  const [farmerSecretKey, setFarmerSecretKey] = useState<string | null>(null);
  const [launcherID, setLauncherID] = useState<string | null>(null);
  const [farmerSkExtractionMethod, setFarmerSkExtractionMethod] = useState<string | null>(
    null
  );
  const [workerName, setWorkerName] = useState<string | null>(null);
  const [region, setRegion] = useState('' as string | string[]);
  const [payoutAddress, setPayoutAddress] = useState<string | null>(null);
  const [os, setOS] = useState<string | null>(null);

  const { t: localT } = useTranslation('guide-flexfarmer');
  const { t: globalT } = useTranslation('get-started');

  const configTemplate = `plot_directories: # Directories (folder paths) where plots are located
      - "/plotdir1"
      - "/plotdir2"
    farmer_secret_key: "${
      farmerSecretKey ? farmerSecretKey : 'N/A'
    }" # Used to sign partials and blocks
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
      setLauncherID((parsedSearch.launcherID as string) || 'N/A');
    }
    if (parsedSearch.workerName !== workerName) {
      setWorkerName((parsedSearch.workerName as string) || 'N/A');
    }
    if (parsedRegion !== region) {
      setRegion(parsedRegion || 'N/A');
    }
    if (parsedSearch.payoutAddress !== payoutAddress) {
      setPayoutAddress((parsedSearch.payoutAddress as string) || 'N/A');
    }
    if (parsedSearch.farmerSkExtractionMethod !== farmerSkExtractionMethod) {
      setFarmerSkExtractionMethod(
        (parsedSearch.farmerSkExtractionMethod as string) || 'browser'
      );
    }
    if (parsedSearch.os !== os) {
      setOS((parsedSearch.os as string) || 'linux');
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
      {/* TODO: Normal seo */}
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
      <Content paddingLg>
        <div id="intro">
          <h1 className="mb-8">{localT(`title`)}</h1>
          <p>{localT(`description`)}</p>
        </div>

        <Spacer size="xl" />

        <div id="requirements">
          <h2>{localT('requirements.heading')}</h2>
          <GuideList listItems={localT('requirements.list', { returnObjects: true })} />
        </div>

        <Spacer size="xl" />

        <div id="select-os">
          <h2>
            <Highlight>#1</Highlight> {localT('select_os.heading')}
          </h2>
          <ButtonGroupOSSelector />
        </div>

        <Spacer size="xl" />

        <div id="download-flexfarmer">
          <h2>
            <Highlight>#2</Highlight> {localT('download_farmer.heading')}
          </h2>
          <FlexfarmerDownloads version={latestVersion as string} />
        </div>

        <Spacer size="xl" />

        <div id="extract-farmer-secret-key">
          <h2>
            <Highlight>#3</Highlight> {localT('farmer_secret_key.heading')}
          </h2>
          <p>{localT('farmer_secret_key.description_extract')}</p>
          <Spacer />

          <div id="extract-farmer-secret-key-method-selector">
            <ButtonGroupFarmerSkExtractionMethodSelector />
          </div>
          <Spacer />
          {farmerSkExtractionMethod === 'browser' ? (
            <FarmerSkExtractor setExternalFarmerSk={setFarmerSecretKey} />
          ) : (
            <>
              <TerminalCommand
                cmd={`python3 extract_farmer_key.py `}
                output={`Enter your mnemonic > `}
              />

              <p>{localT('farmer_secret_key.description_mnemonic')}</p>

              <GuideInput
                label={localT('farmer_secret_key.input_label')}
                placeholderText={`0xf61398a76cdbd6ee5d0f31d757ca96c549876b287c0b19becd26e9e2990eae3e`}
                setExternalValue={(value: string | null) => {
                  setFarmerSecretKey(value);
                }}
                regexp={/^(0x)?[A-Fa-f0-9]{64}$/}
              />
            </>
          )}
        </div>

        <Spacer size="xl" />

        <div id="copy-launch-id">
          <h2>
            <Highlight>#3</Highlight> {localT('launcher_id.heading')}
          </h2>
          <p>
            <Trans
              ns="guide-flexfarmer"
              i18nKey="launcher_id.description"
              components={{
                command: <b />,
              }}
            />
          </p>

          <Spacer />

          <TerminalCommand cmd={`chia plotnft show`} output={chiaPlotNFTOutput} />

          <Spacer />
          <GuideInput
            label={'Launcher ID'}
            placeholderText={`0x2be1162ad1148809bd01c81cea6eba4f9531fd7d330ab8df34404b5a33facd60`}
            setExternalValue={(value: string | null) => {
              setLauncherID(value);
            }}
            regexp={/^(0x)?[A-Fa-f0-9]{64}$/}
          />
        </div>

        <h2>
          <Highlight>#4</Highlight> {localT('payout_address.heading')}
        </h2>

        <p>{localT('payout_address.description')}</p>
        <Spacer />

        <div id="name-worker">
          <GuideInput
            label={localT('payout_address.input_label')}
            placeholderText={`xch1a3ncr9ks4wk8c0npzmge8y6u2df8vx0ym5j5747cye0cwhm0zg8ssmj380`}
            setExternalValue={(value: string | null) => {
              setPayoutAddress(value);
            }}
            verifyFunc={(s: string) => checksumXCH(s) !== null}
          />
        </div>

        <h2>
          <Highlight>#5</Highlight> {localT('worker_name.heading')}
        </h2>

        <p>{localT('worker_name.description')}</p>
        <Spacer />
        <div id="name-worker">
          <GuideInput
            label={localT('worker_name.input_label')}
            placeholderText={`my_chia_rig`}
            setExternalValue={(value: string | null) => {
              setWorkerName(value);
            }}
            regexp={/^[\w.#@:$%()!+,/\'\*-]*$/}
          />
        </div>

        <h2>
          <Highlight>#6</Highlight> {globalT('detail.region.title')}
        </h2>

        <p>{globalT('detail.region.description_chia')}</p>
        <Spacer />
        <PingTestSection data={mineableCoin?.regions as MineableCoinRegion[]} />

        <h2>
          <Highlight>#7</Highlight> {localT('config.heading')}
        </h2>
        <p>
          <Trans
            ns="guide-flexfarmer"
            i18nKey="config.description"
            components={{ config: <b /> }}
          />
        </p>
        <Spacer />

        <Code language="yaml">{configTemplate}</Code>

        <h2>
          <Highlight>#8</Highlight> {localT('run.heading')}
        </h2>

        <p>
          {os === 'windows' ? (
            <Trans
              ns="guide-flexfarmer"
              i18nKey="run.description_windows"
              components={{ file: <b /> }}
            />
          ) : (
            localT('run.description')
          )}
        </p>

        {os !== 'windows' ? (
          <>
            <Spacer />
            <TerminalCommand cmd={'./flexfarmer -c config.yml'} />
          </>
        ) : null}

        <Spacer size="xl" />
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
