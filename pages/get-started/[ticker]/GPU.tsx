import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { MineableCoinGuidePage } from '../../../src/pages/GetStarted/GPU/CoinGuide.page';

export const GetStartedNicehashPage = () => {
  return (
    <Page>
      {/* <Helmet>
        <title>Start mining with Flexpool</title>
      </Helmet> */}
      <Content paddingLg>
        <MineableCoinGuidePage />
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
