import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import styled from 'styled-components';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';

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
const AutoUpdateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
  align-self: flex-start;
`;

const ActiveToggle = styled(FaToggleOn)`
  color: var(--primary);
  margin-left: 0.5rem;
  height: 22px;
  width: 80px;
`;

const InactiveToggle = styled(FaToggleOff)`
  color: var(--text-secondary);
  margin-left: 0.5rem;
  height: 22px;
  width: 80px;
`;

const ToggleWrapperButton = styled(Button)`
  padding: 0 0 0 0;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  height: 20px;
  width: 40px;
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
  const [counter, setCounter] = React.useState(60);

  const [autoRefresh, setAutoRefresh] = useLocalStorageState<'auto' | 'manual'>(
    'auto_refresh_status',
    'auto'
  );

  const autoRefreshMethod = () => {
    if (autoRefresh === 'auto') {
      onRefresh();
      setCounter(60);
    }
  };

  React.useEffect(() => {
    counter > 0 && autoRefresh === 'auto'
      ? setTimeout(() => setCounter(counter - 1), 1000)
      : autoRefreshMethod();
  }, [counter]);

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
      <AutoUpdateWrapper>
        <div>
          {autoRefresh === 'auto' ? (
            <span>
              {t('header.update_in')} {counter}
            </span>
          ) : (
            <span>{t('header.auto_update')}</span>
          )}
        </div>
        <div>
          <ToggleWrapperButton
            variant="transparent"
            onClick={() => {
              setAutoRefresh(autoRefresh === 'auto' ? 'manual' : 'auto');
              setCounter(59);
            }}
          >
            {autoRefresh === 'auto' ? <ActiveToggle /> : <InactiveToggle />}
          </ToggleWrapperButton>
        </div>
      </AutoUpdateWrapper>
    </Wrap>
  );
};
