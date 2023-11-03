import React from 'react';
import { NextSeo } from 'next-seo';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import format from 'date-fns/format';

// Components
import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { Spacer } from '../src/components/layout/Spacer';
import { Sticker } from '../src/components/Sticker';
import { LatestReport } from '../src/pages/Reports/components/LatestReport/LatestReport';
import {
  ReportArchiveItem,
  ReportTitle,
} from '../src/pages/Reports/components';
import { useLocalizedDateFormatter } from '../src/utils/date.utils';

/**
 * After May 2021, yearly transparency reports are provided in replace of the old monthly open data reports
 * Open data reports are available from Oct 2020 to May 2021
 */
const OPEN_DATA_REPORTS_DATE = [
  '2021-05-01',
  '2021-04-01',
  '2021-03-01',
  '2021-02-01',
  '2021-01-01',
  '2020-12-01',
  '2020-11-01',
  '2020-10-01',
];

const getTransparencyReportUrlByYear = (year: string) => {
  return `https://static.flexpool.io/opendata/fp-transparency-report-${year}.pdf`;
};

const getReportUrlByDate = (date: Date) =>
  `https://static.flexpool.io/opendata/opendata_report_${format(
    date,
    'y_MM'
  )}.pdf`;

export const OpenDataReportsPage = ({ lastReportYear }) => {
  const { t } = useTranslation('reports');
  const dateFormatter = useLocalizedDateFormatter();

  return (
    <Page>
      <NextSeo
        title={t('head_title')}
        openGraph={{
          title: t('head_title'),
        }}
      />

      <Content md paddingLg>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
        <LatestReport
          date={new Date(`${lastReportYear}`)}
          src={getTransparencyReportUrlByYear(lastReportYear)}
        />
        <Spacer />
        <h2>{t('archive')}</h2>
        {OPEN_DATA_REPORTS_DATE.map((item) => {
          let date = new Date(item);

          return (
            <ReportArchiveItem
              key={dateFormatter.format(item, 'LLLL yy')}
              href={getReportUrlByDate(date)}
            >
              <div>
                <ReportTitle>{t('report_item')} - </ReportTitle>
                {dateFormatter.format(date, 'LLLL y')}
              </div>
              <div>
                <Sticker variant="primary">PDF</Sticker>
              </div>
            </ReportArchiveItem>
          );
        })}
      </Content>
    </Page>
  );
};

export default OpenDataReportsPage;

export async function getStaticProps({ locale }) {
  // const lastReportYear = await fetch(
  //   'https://static.flexpool.io/opendata/last-report'
  // ).then((res) => res.text());
  const lastReportYear = 2021;

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'reports',
        'cookie-consent',
      ])),
      lastReportYear,
    },
  };
}
