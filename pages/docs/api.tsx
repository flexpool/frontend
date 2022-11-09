import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { useApiDocQuery } from '@/hooks/api/useApiDocQuery';
import { ApiDocViewer } from '@/components/ApiDocViewer';
import { Header } from '@/components/layout/Header';

export const ApiDocsPage = () => {
  const { t: seoT, i18n } = useTranslation('seo');

  const { data, isLoading } = useApiDocQuery();

  return (
    <Page>
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
      <Header>
        <h1>API Documentation</h1>
      </Header>

      <Spacer size="md" />

      <ApiDocViewer endpoints={data} isLoading={isLoading} />

      <Spacer size="xl" />
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
        'api',
      ])),
    },
  };
}
