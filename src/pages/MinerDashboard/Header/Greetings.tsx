import React from 'react';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components';

export function getGreeting() {
  const hours = new Date().getHours();
  if (13 > hours && hours >= 5) {
    return 'Good morning';
  } else if (18 > hours && hours >= 13) {
    return 'Good afternoon';
  } else if (24 > hours && hours >= 18) {
    return 'Good evening';
  }

  return 'Good night';
}

const Greeting = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Wrap = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

export const HeaderGreetings: React.FC<{
  coin?: ApiPoolCoin;
}> = ({ coin }) => {
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const minerStatsState = useReduxState('minerStats');

  const data = minerHeaderStatsState.data;

  const greeting = React.useMemo(() => {
    return getGreeting();
  }, []);

  return (
    <Wrap>
      <Greeting>{greeting}</Greeting>
      <span>
        , {data ? data.workersOnline : '-'} workers are mining{' '}
        {coin ? coin.name : '---'}
        {data
          ? data.workersOffline
            ? ` (${data.workersOffline} offline)`
            : null
          : null}
        , and are hashing{' '}
        {minerStatsState.data
          ? minerStatsState.data.reportedHashrate > 0
            ? formatSi(minerStatsState.data.reportedHashrate, 'H/s')
            : formatSi(minerStatsState.data.averageEffectiveHashrate, 'H/s')
          : '- H/s'}{' '}
        in total.
      </span>
    </Wrap>
  );
};
