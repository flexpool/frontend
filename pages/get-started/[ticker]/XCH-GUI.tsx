import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { ChiaGuiGuidePage } from 'src/pages/GetStarted/ChiaGui/Guide.page';

export const GetStartedXchGuiPage = () => {
  return (
    <Page>
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
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

export const getStaticPaths = ({ locales }) => {
  const paths = [];

  for (const locale of locales) {
    paths.push({ params: { ticker: 'xch', hw: 'XCH-GUI' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
