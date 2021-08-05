import { useMemo } from 'react';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Page } from 'src/components/layout/Page';
import { Content } from 'src/components/layout/Content';
import { default as FlexFarmerGuide } from 'guides/flexfarmer.mdx';
import { MineableCoinHardware, mineableCoins } from 'src/pages/GetStarted/mineableCoinList';

export const GetStartedFlexfarmerPage = ({ ticker }) => {

  const mineableCoin = useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation('get-started');

  return (
    <Page>
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
      <Content paddingLg>
        <FlexFarmerGuide t={t} mineableCoin={mineableCoin} />
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
