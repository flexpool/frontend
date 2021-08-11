import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { ChiaCliGuidePage } from '../../../src/pages/GetStarted/ChiaCli/Guide.page';

export const GetStartedXchCliPage = () => {
  return (
    <Page>
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
        'seo',
      ])),
    },
  };
}

export const getStaticPaths = ({ locales }) => {
  const paths = [];

  for (const locale of locales) {
    paths.push({ params: { ticker: 'xch', hw: 'XCH-CLI' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
