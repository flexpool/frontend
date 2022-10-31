import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { NicehashGuidePage } from 'src/pages/GetStarted/Nicehash/NicehashGuide.page';

export const GetStartedNicehashPage = () => {
  return (
    <Page>
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
    paths.push({ params: { ticker: 'etc', hw: 'nicehash' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
