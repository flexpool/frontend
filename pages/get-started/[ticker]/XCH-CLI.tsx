import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { ChiaCliGuidePage } from '../../../src/pages/GetStarted/ChiaCli/Guide.page';

export const GetStartedXchCliPage = () => {
  return (
    <Page>
      <Head>
        <title>Start mining with Flexpool</title>
      </Head>
      <Content paddingLg>
        <ChiaCliGuidePage />
      </Content>
    </Page>
  );
};

export default GetStartedXchCliPage;

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

export const getStaticPaths = ({ locales }) => {
  const paths = [];

  for (const locale of locales) {
    paths.push({ params: { slug: 'XCH-CLI' }, locale });
  }

  return {
    paths: [],
    fallback: false,
  };
};
