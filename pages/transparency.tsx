import React from 'react';
import { NextSeo } from 'next-seo';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAfter, subMonths } from 'date-fns';
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

const getTransparencyReportUrlByYear = (year: string) => {
  return `https://static.flexpool.io/opendata/fp-transparency-report-${year}.pdf`;
};

const getReportUrlByDate = (date: Date) =>
  `https://static.flexpool.io/opendata/opendata_report_${format(
    date,
    'y_MM'
  )}.pdf`;

/**
 * tries to get the latest report date (month)
 */
const getLatestReportDate = async () => {
  let attempts = 0;
  let date = new Date();
  let resDate: Date | null = null;

  while (attempts < 10 && !resDate) {
    const dateStatus = await fetch(getReportUrlByDate(date), {
      method: 'HEAD',
    }).then((res) => res.status);

    if (dateStatus === 200) {
      resDate = date;
    } else {
      attempts += 1;
      date = subMonths(date, 1);
    }
  }

  return Promise.resolve(resDate);
};

/**
 * returns dates from latest report to the first report (Oct 2020)
 */
const getDates = async () => {
  const oldestReport = new Date('2020-10-01');
  const latestReportDate = await getLatestReportDate();
  if (latestReportDate === null) {
    return [];
  }
  let date = latestReportDate;
  const dates: Array<Date> = [];

  while (isAfter(date, oldestReport)) {
    dates.push(date);
    date = subMonths(date, 1);
  }

  return dates;
};

export const OpenDataReportsPage = ({ dates, lastReportYear }) => {
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
        {(dates || []).map((item) => (
          <ReportArchiveItem
            key={dateFormatter.format(item, 'LLLL yy')}
            href={getReportUrlByDate(item)}
          >
            <div>
              <ReportTitle>{t('report_item')} - </ReportTitle>
              {dateFormatter.format(item, 'LLLL y')}
            </div>
            <div>
              <Sticker variant="primary">PDF</Sticker>
            </div>
          </ReportArchiveItem>
        ))}
      </Content>
    </Page>
  );
};

export default OpenDataReportsPage;

export async function getStaticProps({ locale }) {
  const dates = await getDates();

  const lastReportYear = await fetch(
    'https://static.flexpool.io/opendata/last-report'
  ).then((res) => res.text());

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'reports',
        'cookie-consent',
      ])),
      dates: dates,
      lastReportYear,
    },
  };
}
