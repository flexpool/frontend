import { useState } from 'react';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import SwaggerUI from 'swagger-ui-react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { LoaderOverlayWithin } from '@/components/Loader/LoaderOverlayWithin';

export const ApiDocsPage = () => {
  const { t: seoT, i18n } = useTranslation('seo');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Page>
      <Content style={{ position: 'relative' }} padding>
        <NextSeo
          title={seoT('title.api_documentation')}
          description={seoT('website_description.api_documentation')}
          openGraph={{
            title: seoT('title.api_documentation'),
            description: seoT('website_description.api_documentation'),
            locale: i18n.language,
          }}
          additionalMetaTags={[
            {
              property: 'keywords',
              content: seoT('keywords.api_documentation'),
            },
          ]}
        />
        <Spacer size="xl" />
        {isLoading && <LoaderOverlayWithin />}

        <SwaggerUI
          url="https://static.flexpool.io/api/openapi.json"
          onComplete={() => {
            setIsLoading(false);
          }}
        />

        <Spacer size="xl" />
      </Content>
    </Page>
  );
};

export default ApiDocsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}
