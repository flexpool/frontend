import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { ChiaGuiGuidePage } from '../../../src/pages/GetStarted/ChiaGui/Guide.page';

export const GetStartedXchGuiPage = () => {
  return (
    <Page>
      <Head>
        <title>Start mining with Flexpool</title>
      </Head>
      <Content paddingLg>
        <ChiaGuiGuidePage />
      </Content>
    </Page>
  );
};

export default GetStartedXchGuiPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'get-started',
        'cookie-consent',
      ])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
