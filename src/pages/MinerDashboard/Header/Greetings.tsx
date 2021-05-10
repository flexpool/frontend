import React from 'react';
import { useTranslation } from 'react-i18next';
import { BiRefresh } from 'react-icons/bi';
import { Button } from 'src/components/Button';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import styled from 'styled-components';

export function getGreeting() {
  const hours = new Date().getHours();
  if (13 > hours && hours >= 4) {
    return 'morning';
  } else if (18 > hours && hours >= 13) {
    return 'afternoon';
  }

  return 'evening';
}

const Greeting = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Wrap = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RefreshButton = styled(Button)`
  font-size: 1.5rem;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const HeaderGreetings: React.FC<{ onRefresh: () => void }> = ({
  onRefresh,
}) => {
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const minerStatsState = useReduxState('minerStats');
  const siFormatter = useLocalizedSiFormatter();
  const activeCoin = useActiveCoin();
  const { t } = useTranslation('dashboard');

  const data = minerHeaderStatsState.data;

  const greetingId = React.useMemo(() => {
    return getGreeting();
  }, []);

  const workersOnline = data?.workersOnline || 0;
  const hashrate = minerStatsState.data
    ? minerStatsState.data.reportedHashrate > 0
      ? siFormatter(minerStatsState.data.reportedHashrate, {
          unit: 'H/s',
        })
      : siFormatter(minerStatsState.data.currentEffectiveHashrate, {
          unit: 'H/s',
        })
    : '- H/s';

  return (
    <Wrap>
      <div>
        <Greeting>{t(`header.greet_period_${greetingId}`)}</Greeting>
        {', '}
        <span>
          {t(`header.greet_desc`, {
            count: workersOnline,
            hashrate,
            coin: activeCoin?.name,
          })}
        </span>
      </div>
      <div>
        <RefreshButton size="sm" shape="square" onClick={onRefresh}>
          <BiRefresh />
        </RefreshButton>
      </div>
    </Wrap>
  );
};
