import { Helmet } from 'react-helmet-async';

import { HeaderStat } from 'src/components/layout/StatHeader';
import styled from 'styled-components/macro';
import { TopDonatorsSection } from './TopDonors.section';
import { TopMinersSection } from './TopMiners.section';

export const MinersPage = () => {
  return (
    <>
      <Helmet>
        <title>Miners</title>
      </Helmet>
      <HeaderStat>
        <h1>Miners leaderboard</h1>
      </HeaderStat>
      <TopMinersSection />
      <TopDonatorsSection />
    </>
  );
};
