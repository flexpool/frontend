import { isAfter, subMonths } from 'date-fns';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { Sticker } from 'src/components/Sticker';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { dateUtils } from 'src/utils/date.utils';
import styled from 'styled-components/macro';
import { LatestReport } from './LatestReport';

const ReportArchiveItem = styled(LinkOut)`
  display: block;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--border-color);
  margin-bottom: -1px;
  align-items: center;
  &:hover {
    background: var(--bg-secondary);
    text-decoration: none;
  }
`;

const ReportTitle = styled.span`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const getReportUrlByDate = (date: Date) =>
  `https://static.flexpool.io/opendata/opendata_report_${dateUtils.format(
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

  return (
    <Page>
      <Helmet>
        <title>Open Data Reports</title>
      </Helmet>
      <Content md paddingLg>
        <h1>Open Data Reports</h1>
        <p>
          Our initiative to provide clear and transparent progress reports about
          what we are doing at Flexpool.
        </p>
        {latestDate && (
          <LatestReport
            date={latestDate}
            src={getReportUrlByDate(latestDate)}
          />
        )}
        <Spacer />
        <h2>Reports Archive</h2>
        {(datesState.data || []).map((item) => (
          <ReportArchiveItem
            key={dateUtils.format(item, 'MMMM yy')}
            href={getReportUrlByDate(item)}
          >
            <div>
              <ReportTitle>Flexpool Progress Report - </ReportTitle>
              {dateUtils.format(item, 'MMMM y')}
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
