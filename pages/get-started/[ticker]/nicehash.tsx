import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { NicehashGuidePage } from '../../../src/pages/GetStarted/Nicehash/NicehashGuide.page';

export const GetStartedNicehashPage = () => {
  return (
    <Page>
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
      <Content paddingLg>
        <NicehashGuidePage />
      </Content>
    </Page>
  );
};

export default GetStartedNicehashPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'get-started',
        'nicehash',
        'cookie-consent',
      ])),
    },
  };
}

export const getStaticPaths = ({ locales }) => {
  const paths = [];

  for (const locale of locales) {
    paths.push({ params: { ticker: 'eth', hw: 'nicehash' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
