import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../src/components/layout/Content';
import { Page } from '../../src/components/layout/Page';
import { MineableCoinList } from '../../src/pages/GetStarted/CoinList.page';
import { useTranslation } from 'next-i18next';

export const GetStartedPage = () => {
  const { t: seoT, i18n } = useTranslation('seo');

  return (
    <Page>
      <NextSeo
        title={seoT('title.get_started_home')}
        description={seoT('website_description.get_started_home')}
        openGraph={{
          title: seoT('title.get_started_home'),
          description: seoT('website_description.get_started_home'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.get_started_home'),
          },
        ]}
      />
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
        'seo',
      ])),
    },
  };
}
