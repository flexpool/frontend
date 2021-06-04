import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import styled from 'styled-components';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';
import { LoaderDots } from 'src/components/Loader/LoaderDots';

export function getGreeting() {
  const hours = new Date().getHours();
  if (13 > hours && hours >= 4) {
    return 'morning';
  } else if (18 > hours && hours >= 13) {
    return 'afternoon';
  }

  return 'evening';
}

const Wrap = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ToggleWrapper = styled.div`
  align-self: center;
`;

const AutoUpdateWrapper = styled.div`
  display: flex;
  justify-content: center;
  color: var(--text-primary);
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const AutoUpdateText = styled.span`
  align-self: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin-left: 9px;
  color: var(--text-primary);
  &.inactive {
    color: var(--text-secondary);
  }
`;

const ActiveToggle = styled(FaToggleOn)`
  color: var(--primary);
  height: 20px;
  width: 40px;
`;

const InactiveToggle = styled(FaToggleOff)`
  color: var(--text-secondary);
  height: 20px;
  width: 40px;
`;

const ToggleWrapperButton = styled(Button)`
  min-width: 156px;
  padding: 0 0 0 0;
  border: none;
  height: 42px;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  color: var(--text-secondary);
  justify-content: center;
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
  const [autoRefreshDelay, setAutoRefreshDelay] =
    React.useState<boolean>(false);
  const autoRefreshToggle = () => {
    setAutoRefresh(autoRefresh === 'auto' ? 'manual' : 'auto');
    setCounter(59);
    setAutoRefreshDelay(true);
    setTimeout(() => {
      setAutoRefreshDelay(false);
    }, 1000);
  };

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
  });

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
        <span>{t(`header.greet_period_${greetingId}`)}</span>
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
        <ToggleWrapper>
          <ToggleWrapperButton
            variant="transparent"
            onClick={autoRefreshToggle}
            disabled={autoRefreshDelay}
          >
            {autoRefreshDelay ? (
              <LoaderDots />
            ) : (
              <>
                <AutoUpdateText
                  className={autoRefresh === 'manual' ? 'inactive' : ''}
                >
                  {autoRefresh === 'auto' ? (
                    <span>
                      {t('header.update_in')} {counter}
                    </span>
                  ) : (
                    <span>{t('header.auto_update')}</span>
                  )}
                </AutoUpdateText>
                {autoRefresh === 'auto' ? <ActiveToggle /> : <InactiveToggle />}
              </>
            )}
          </ToggleWrapperButton>
        </ToggleWrapper>
      </AutoUpdateWrapper>
    </Wrap>
  );
};
