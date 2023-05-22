import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';

export const GetStartedASICPage = () => {
  return (
    <Page>
      <Content paddingLg></Content>
    </Page>
  );
};

export default GetStartedASICPage;

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
  const paths: Array<{ params: { ticker: string; hw: string }; locale: any }> =
    [];

  // for (const locale of locales) {
  //   paths.push();
  // }

  return {
    paths: paths,
    fallback: false,
  };
};
