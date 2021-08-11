// TODO: Remove this TS nocheck
// @ts-nocheck
import { isAfter, subMonths } from 'date-fns';
import React from 'react';
import { useTranslation } from 'next-i18next';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { Sticker } from 'src/components/Sticker';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import { LatestReport } from './components/LatestReport/LatestReport';
import format from 'date-fns/format';
import { ReportArchiveItem, ReportTitle } from './components';

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
  const dates = [];

  while (isAfter(date, oldestReport)) {
    dates.push(date);
    date = subMonths(date, 1);
  }

  return dates;
};

export const OpenDataReportsPage = () => {
  const datesState = useAsyncState<Date[]>('reportDates', []);
  React.useEffect(() => {
    datesState.start(getDates());
    // eslint-disable-next-line
  }, []);

  const latestDate: Date | undefined = (datesState.data || [])[0];
  const { t } = useTranslation('reports');
  const dateFormatter = useLocalizedDateFormatter();

  return (
    <Page>
      <Content md paddingLg>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
        {latestDate && (
          <LatestReport
            date={latestDate}
            src={getReportUrlByDate(latestDate)}
          />
        )}
        <Spacer />
        <h2>{t('archive')}</h2>
        {(datesState.data || []).map((item) => (
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
