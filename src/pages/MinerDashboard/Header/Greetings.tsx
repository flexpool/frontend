import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from 'src/components/Button';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { useMinerWorkersStatus } from '@/rdx/minerWorkers/minerWorkers.hooks';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import styled from 'styled-components';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';
import LoaderDots from 'src/components/Loader/LoaderDots';
import useIsMounted from '@/hooks/useIsMounted';

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
  const minerStatsState = useReduxState('minerStats');
  const siFormatter = useLocalizedSiFormatter();
  const activeCoin = useActiveCoin();
  const workerStatus = useMinerWorkersStatus();
  const { t } = useTranslation('dashboard');
  const isMounted = useIsMounted();

  const [counter, setCounter] = useLocalStorageState<number>(
    'auto_refresh_ticker',
    60
  );
  const [timeoutValue, setTimeoutValue] = useLocalStorageState<
    number | undefined
  >('auto_refresh_timeout_value', undefined);
  const [queuedDownTick, setQueuedDownTick] = useLocalStorageState<boolean>(
    'queued_down_tick',
    false
  );
  const [refreshInProgress, setRefreshInProgress] =
    useLocalStorageState<boolean>('stats_refresh_in_progress', false);
  const [queuedCounterValue, setQueuedCounterValue] = useLocalStorageState<
    number | undefined
  >('queued_counter_value', undefined);

  const [autoRefresh, setAutoRefresh] = useLocalStorageState<'auto' | 'manual'>(
    'auto_refresh_config',
    'manual'
  );
  const autoRefreshToggle = () => {
    setAutoRefresh(autoRefresh === 'auto' ? 'manual' : 'auto');
    if (timeoutValue) {
      clearTimeout(timeoutValue);
      setTimeoutValue(undefined);
      setQueuedDownTick(false);
      setCounter(59);
    } else {
      setCounter(59);
    }
  };
  React.useEffect(() => {
    const resetDataOnManualPageRefresh = () => {
      window.localStorage.removeItem('queued_down_tick');
      window.localStorage.removeItem('queued_counter_value');
      window.localStorage.removeItem('stats_refresh_in_progress');
      window.localStorage.removeItem('auto_refresh_timeout_value');
      window.localStorage.setItem('auto_refresh_ticker', '60');
    };
    window.addEventListener('beforeunload', resetDataOnManualPageRefresh);
    return () => {
      setTimeout(() => {
        window.localStorage.removeItem('queued_down_tick');
        window.localStorage.removeItem('queued_counter_value');
        window.localStorage.removeItem('stats_refresh_in_progress');
        window.localStorage.removeItem('auto_refresh_timeout_value');
        window.localStorage.setItem('auto_refresh_ticker', '60');
      }, 1000);
      window.removeEventListener('beforeunload', resetDataOnManualPageRefresh);
    };
  }, []);
  React.useEffect(() => {
    const autoRefreshMethod = () => {
      if (autoRefresh === 'auto' && counter === 0 && !refreshInProgress) {
        onRefresh();
        setRefreshInProgress(true);
        setTimeout(() => {
          setCounter(60);
          setRefreshInProgress(false);
        }, 1000);
      } else if (
        counter === 0 &&
        !refreshInProgress &&
        !queuedDownTick &&
        !queuedCounterValue
      ) {
        setCounter(60);
      }
    };
    const runDownTick = () => {
      setCounter(queuedCounterValue || counter - 1);
      if (queuedCounterValue) {
        setQueuedCounterValue(undefined);
      }
      setQueuedDownTick(false);
    };
    if (counter > 0 && autoRefresh === 'auto' && queuedDownTick === false) {
      setQueuedDownTick(true);
      setTimeoutValue(
        window.setTimeout(() => {
          runDownTick();
        }, 1000)
      );
    } else if (counter === 0) {
      autoRefreshMethod();
    }
  }, [
    counter,
    autoRefresh,
    queuedDownTick,
    queuedCounterValue,
    refreshInProgress,
    setCounter,
    setQueuedDownTick,
    onRefresh,
    setQueuedCounterValue,
    setRefreshInProgress,
    setTimeoutValue,
  ]);

  const greetingId = React.useMemo(() => {
    return getGreeting();
  }, []);

  const workersOnline = workerStatus?.online || 0;
  const hashrate = minerStatsState.data
    ? minerStatsState.data.reportedHashrate > 0
      ? siFormatter(minerStatsState.data.reportedHashrate, {
          unit: activeCoin?.hashrateUnit,
        })
      : siFormatter(minerStatsState.data.currentEffectiveHashrate, {
          unit: activeCoin?.hashrateUnit,
        })
    : '- ' + activeCoin?.hashrateUnit;

  return (
    <Wrap>
      <div>
        <span>{t(`header.greet_period_${greetingId}`)}</span>
        {', '}
        <span>
          {activeCoin?.ticker === 'xch'
            ? t(`header.greet_desc_farm`, {
                count: workersOnline,
                hashrate: hashrate || '',
                coin: activeCoin?.name,
              })
            : t(`header.greet_desc`, {
                count: workersOnline,
                hashrate: hashrate || '',
                coin: activeCoin?.name,
              })}
        </span>
      </div>
      <AutoUpdateWrapper>
        <ToggleWrapper>
          <ToggleWrapperButton
            variant="transparent"
            onClick={autoRefreshToggle}
            disabled={counter === 0}
          >
            {counter === 0 ? (
              <LoaderDots />
            ) : (
              <>
                <AutoUpdateText
                  className={autoRefresh === 'manual' ? 'inactive' : ''}
                >
                  {autoRefresh === 'auto' ? (
                    <span>
                      {t('header.update_in')} {queuedCounterValue || counter}
                    </span>
                  ) : (
                    <span>{t('header.auto_update')}</span>
                  )}
                </AutoUpdateText>
                {isMounted &&
                  (autoRefresh === 'auto' ? (
                    <ActiveToggle />
                  ) : (
                    <InactiveToggle />
                  ))}
              </>
            )}
          </ToggleWrapperButton>
        </ToggleWrapper>
      </AutoUpdateWrapper>
    </Wrap>
  );
};
