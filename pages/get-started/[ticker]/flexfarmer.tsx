import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Page } from 'src/components/layout/Page';
import { Content } from 'src/components/layout/Content';
import { default as FlexFarmerGuide } from 'guides/flexfarmer.mdx';

export const GetStartedNicehashPage = () => {
  return (
    <Page>
      <NextSeo
        title={'Start mining with Flexpool'}
        openGraph={{
          title: 'Start mining with Flexpool',
        }}
      />
      <FlexFarmerGuide />
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
        'cookie-consent',
      ])),
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
