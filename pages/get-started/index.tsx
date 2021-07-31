import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../src/components/layout/Content';
import { Page } from '../../src/components/layout/Page';
import { MineableCoinList } from '../../src/pages/GetStarted/CoinList.page';

export const GetStartedPage = () => {
  return (
    <Page>
      <Head>
        <title>Start mining with Flexpool</title>
      </Head>
      <Content paddingLg>
        <MineableCoinList />
      </Content>
    </Page>
  );
};

export default GetStartedPage;

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
