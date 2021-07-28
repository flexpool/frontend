import React from 'react';
import Head from 'next/head';
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
  const { t } = useTranslation('miners');

  return (
    <Page>
      <Head>
        <title>{t('head_title')}</title>
      </Head>
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
      <LoaderSpinner style={{ minHeight: '26rem', display: 'flex' }} />
    ),
    ssr: false,
  }
);
