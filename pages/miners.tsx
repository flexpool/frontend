import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { Spacer } from '../src/components/layout/Spacer';
import { HeaderStat } from '../src/components/layout/StatHeader';
import { TopMinersSection } from '../src/pages/Miners/components/TopMiners/TopMiners.section';
import { LoaderSpinner } from '../src/components/Loader/LoaderSpinner';

function MinersPage() {
  const { t, i18n } = useTranslation('miners');
  const { t: seoT } = useTranslation('seo');

  return (
    <Page>
      <NextSeo
        title={seoT('title.miners')}
        description={seoT('website_description.miners')}
        openGraph={{
          title: seoT('title.miners'),
          description: seoT('website_description.miners'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.miners'),
          },
        ]}
      />

      <HeaderStat>
        <h1>{t('title')}</h1>
      </HeaderStat>

      <Content padding>
        <TopMinersSection />
        <DynamicMinersDistributionChart />
      </Content>

      <Spacer size="xl" />
    </Page>
  );
}

export default MinersPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'miners',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}

const DynamicMinersDistributionChart = dynamic<{}>(
  () =>
    import(
      '../src/pages/Miners/components/MinerDistrubutionChart/MinersDistrubution.chart'
    ).then((module) => module.MinersDistributionChart),
  {
    loading: () => (
      <LoaderSpinner center style={{ minHeight: '26rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);
