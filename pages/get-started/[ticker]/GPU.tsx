import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { MineableCoinGuidePage } from '../../../src/pages/GetStarted/GPU/CoinGuide.page';

export const GetStartedGPUPage = () => {
  return (
    <Page>
      <Content paddingLg>
        <MineableCoinGuidePage />
      </Content>
    </Page>
  );
};

export default GetStartedGPUPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
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
  const paths = [];

  for (const locale of locales) {
    paths.push({ params: { ticker: 'eth', hw: 'GPU' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
