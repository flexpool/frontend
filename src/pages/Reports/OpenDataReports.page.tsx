import { format, isAfter, subMonths } from 'date-fns';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'src/components/layout/Content';
import { Divider } from 'src/components/layout/Divider';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { Sticker } from 'src/components/Sticker';
import styled from 'styled-components/macro';

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

const getDates = () => {
  const oldestReport = new Date('2020-10-01');
  let date = subMonths(new Date(), 1);
  const dates = [];

  while (isAfter(date, oldestReport)) {
    dates.push(date);
    date = subMonths(date, 1);
  }

  return dates;
};

export const OpenDataReportsPage = () => {
  const dates = getDates();

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
        <Spacer />
        {dates.map((item) => (
          <ReportArchiveItem
            key={format(item, 'MMMM yy')}
            href={`https://static.flexpool.io/opendata/opendata_report_${format(
              item,
              'y_MM'
            )}.pdf`}
          >
            <div>
              <ReportTitle>Flexpool Progress Report - </ReportTitle>
              {format(item, 'MMMM y')}
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
