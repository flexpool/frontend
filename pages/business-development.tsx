import { NextSeo } from 'next-seo';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';
import { LinkOut } from '../src/components/LinkOut';

export const BusinessDevelopmentPage = () => {
  const { t, i18n } = useTranslation('business-dev');
  const { t: seoT } = useTranslation('seo');

  return (
    <Page>
      <NextSeo
        title={seoT('title.business_development')}
        description={seoT('website_description.business_development')}
        openGraph={{
          title: seoT('title.business_development'),
          description: seoT('website_description.business_development'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.business_development'),
          },
        ]}
      />

      <Content md paddingLg>
        <h1>{t('title')}</h1>
        <h2>{t('touch.title')}</h2>
        <p>
          <Trans
            i18nKey="touch.description"
            ns="business-dev"
            values={{
              email: 'hq@flexpool.io',
            }}
            components={{
              email: <LinkOut href="mailto:hq@flexpool.io" />,
            }}
          />
        </p>
      </Content>
    </Page>
  );
};

export default BusinessDevelopmentPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'business-dev',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}
