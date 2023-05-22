import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { findCoinsByHardwareKey } from '@/pages/GetStarted/mineableCoinList.utils';
import { useTranslation } from 'next-i18next';

export const GetStartedGPUPage = ({ ticker }: { ticker: string }) => {
  const { t } = useTranslation('get-started');

  return (
    <Page>
      <Content paddingLg></Content>
    </Page>
  );
};

export default GetStartedGPUPage;

export async function getStaticProps({ locale, params }) {
  return {
    props: {
      ticker: params.ticker,
      ...(await serverSideTranslations(locale, [
        'common',
        'get-started',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}

export const getStaticPaths = ({ locales }) => {
  const paths: Array<{ params: { ticker: string; hw: string }; locale: any }> =
    [];

  for (const locale of locales) {
    for (const coin of findCoinsByHardwareKey('dual')) {
      paths.push({ params: { ticker: coin.ticker, hw: 'dual' }, locale });
    }
  }

  return {
    paths: paths,
    fallback: false,
  };
};
