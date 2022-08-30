import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { MineableCoinGuidePage } from 'src/pages/GetStarted/ASIC/CoinGuide.page';

export const GetStartedASICPage = () => {
  return (
    <Page>
      <Content paddingLg>
        <MineableCoinGuidePage />
      </Content>
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

  for (const locale of locales) {
    paths.push({ params: { ticker: 'eth', hw: 'ASIC' }, locale });
    paths.push({ params: { ticker: 'etc', hw: 'ASIC' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
