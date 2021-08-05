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
import { TextInput } from 'src/components/Form/TextInput';

export const GetStartedFlexfarmerPage = ({ ticker }) => {

  const mineableCoin = useMemo(() => {
    return mineableCoins.find((item) => item.ticker === 'xch');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation(['guide-flexfarmer', 'get-started']);

  let payoutAddress;

  const configTemplate =
    `plot_directories:
      - "/plotdir1"
      - "/plotdir2"
    farmer_secret_key: "0xf61398a76cdbd6ee5d0f31d757ca96c549876b287c0b19becd26e9e2990eae3e"
    launcher_id: "0x2be1162ad1148809bd01c81cea6eba4f9531fd7d330ab8df34404b5a33facd60"
    worker_name: myworker
    region: us-east
    payout_address: ${payoutAddress ? payoutAddress : 'xch1fh6f088cxcvqscy4xtxfq7762vhsh9mjcql6m3svfhmlxsc3jd4sd37xdl'}`;

  return (
    <Page>
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
      <Content paddingLg>
        <h1>{t(`title`)}</h1>

        <h2>{t('requirements.heading')}</h2>
        <GuideList listItems={t('requirements.list', { returnObjects: true })} />

        <h2><Highlight>#1</Highlight> {t('select_os.heading')}</h2>
        <ButtonGroupOSSelector />

        <h2><Highlight>#2</Highlight> Download Flexfarmer CLI</h2>
        <FlexfarmerDownloads />

        <h2><Highlight>#3</Highlight> Install Flexfarmer CLI</h2>
        <h2><Highlight>#3</Highlight> Input Farmer Secret Key</h2>
        <p className="mb-5">
          The secret key extracted from your mnemonic phrase.<br></br>
          Please use `extract_farmer_key.py` Python script to extract the Farmer secret key.

          {/* Setup TextInput here */}

          {/* {t('detail.region.description_chia')} */}
        </p>


        <h2><Highlight>#</Highlight> Select Your Region</h2>
        <p className="mb-5">{t('detail.region.description_chia')}</p>
        <PingTestSection data={mineableCoin.regions} className="mt-2" />

        <h2><Highlight>#</Highlight> Select Your Region</h2>

        <h2><Highlight>#</Highlight> Setup Config</h2>
        <TerminalCommand cmd={configTemplate} />
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
      ticker: 'xch'
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
