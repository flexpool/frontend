import React, { useState } from 'react';

import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { useReduxState } from 'src/rdx/useReduxState';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { StatItem } from 'src/components/StatItem';
import { useDailyRewardPerGhState } from 'src/hooks/useDailyRewardPerGhState';
import { poolStatsGet } from 'src/rdx/poolStats/poolStats.actions';
import { useDispatch } from 'react-redux';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { FaCalendar, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import { addSeconds } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import {
  EstimatedIntervalSwitch,
  ProgressBarWrapper,
  ProgressBar,
  ErrorText,
  SecondaryText,
  PayoutText,
  PayoutNumber,
} from './components';

const BalanceProgressBar: React.FC<{
  value: number;
  payoutInSeconds: number;
}> = ({ value, payoutInSeconds }) => {
  const [progress, setProgress] = useState(0);
  React.useLayoutEffect(() => {
    setTimeout(() => {
      setProgress(value);
    }, 100);
  }, [value]);
  const { t } = useTranslation('dashboard');
  const numberFormatter = useLocalizedNumberFormatter();
  const dateFormatter = useLocalizedDateFormatter();

  return (
    <Tooltip
      wrapIcon={false}
      placement="bottom"
      icon={
        <ProgressBarWrapper>
          <ProgressBar
            style={{
              width: `${progress}%`,
              ...(progress === 100
                ? { backgroundColor: 'var(--success)' }
                : {}),
            }}
          />
        </ProgressBarWrapper>
      }
    >
      <TooltipContent>
        <PayoutText>
          <Trans
            i18nKey="header.stat_unpaid_balance_reach"
            ns="dashboard"
            values={{
              value: numberFormatter(progress / 100, {
                style: 'percent',
                maximumFractionDigits: 2,
              }),
            }}
            components={{
              v: <PayoutNumber />,
            }}
          />
        </PayoutText>
        {payoutInSeconds && payoutInSeconds > 0 ? (
          <PayoutText>
            <Trans
              i18nKey="header.stat_unpaid_balance_reach_est"
              ns="dashboard"
              values={{
                value: dateFormatter.distanceFromNow(
                  addSeconds(new Date(), payoutInSeconds)
                ),
              }}
              components={{
                v: <PayoutNumber />,
              }}
            />
          </PayoutText>
        ) : (
          <PayoutText>{t('header.stat_unpaid_balance_reach_ok')}</PayoutText>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

type EstimateInterval = 1 | 7 | 30;

export const HeaderStats: React.FC<{
  coin?: ApiPoolCoin;
}> = () => {
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const minerDetailsState = useReduxState('minerDetails');
  const minerStatsState = useReduxState('minerStats');
  const data = minerHeaderStatsState.data;
  const activeTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  const settings = minerDetailsState.data;
  const d = useDispatch();
  const poolStatsState = useReduxState('poolStats');
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const { t } = useTranslation('dashboard');
  const currencyFormatter = useLocalizedCurrencyFormatter();

  const [
    estimateInterval,
    setEstimateInterval,
  ] = useLocalStorageState<EstimateInterval>('estimateInterval', 1);

  React.useEffect(() => {
    d(poolStatsGet(activeTicker));
  }, [activeTicker, d]);

  const balance = activeCoinFormatter(data?.balance, {
    maximumFractionDigits: 6,
  });
  const tickerBalance = currencyFormatter(data?.balanceCountervalue || 0);

  const dailyRewardPerGhState = useDailyRewardPerGhState();

  const estimatedDailyEarnings = React.useMemo(() => {
    return poolStatsState.data?.averageHashrate &&
      dailyRewardPerGhState.data &&
      minerStatsState.data?.averageEffectiveHashrate
      ? dailyRewardPerGhState.data *
          (minerStatsState.data?.averageEffectiveHashrate / 1000000000)
      : 0;
  }, [poolStatsState.data, dailyRewardPerGhState.data, minerStatsState.data]);

  const estimated = React.useMemo(() => {
    return {
      ticker: estimatedDailyEarnings
        ? activeCoinFormatter(estimatedDailyEarnings * estimateInterval)
        : null,
      counterTicker:
        estimatedDailyEarnings && data?.countervaluePrice
          ? currencyFormatter(
              ((estimatedDailyEarnings * estimateInterval) /
                Math.pow(10, activeCoin?.decimalPlaces || 9)) *
                data.countervaluePrice
            )
          : null,
    };
  }, [
    activeCoinFormatter,
    activeCoin?.decimalPlaces,
    currencyFormatter,
    estimateInterval,
    data?.countervaluePrice,
    estimatedDailyEarnings,
  ]);

  const CalendarIcon = React.useMemo(() => {
    return estimateInterval === 1
      ? FaCalendarDay
      : estimateInterval === 7
      ? FaCalendarWeek
      : FaCalendar;
  }, [estimateInterval]);

  const estimateText =
    estimateInterval === 1
      ? 'daily'
      : estimateInterval === 7
      ? 'weekly'
      : 'monthly';

  const handleToggleEstimateInterval = React.useCallback(() => {
    switch (estimateInterval) {
      case 1: {
        setEstimateInterval(7);
        return;
      }
      case 7: {
        setEstimateInterval(30);
        return;
      }
      case 30: {
        setEstimateInterval(1);
        return;
      }
    }
  }, [estimateInterval, setEstimateInterval]);

  const balanceProgress =
    settings && data
      ? data.balance / settings.payoutLimit > 1
        ? 100
        : (data.balance / settings.payoutLimit) * 100
      : 0;

  const estimatedEarningsPerSecond = estimatedDailyEarnings / 24 / 60 / 60;
  const amountToPayout =
    settings && data ? settings.payoutLimit - data.balance : 0;
  const amountToPayoutTimeInSeconds =
    amountToPayout / estimatedEarningsPerSecond || 0;

  return (
    <CardGrid>
      <Card padding>
        <CardTitle>{t('header.stat_workers')}</CardTitle>
        <StatItem
          value={
            data ? (
              <>
                {data.workersOnline}
                {'/'}
                {data.workersOffline > 0 ? (
                  <ErrorText>{data.workersOffline}</ErrorText>
                ) : (
                  <SecondaryText>{data.workersOffline}</SecondaryText>
                )}
              </>
            ) : null
          }
        />
      </Card>
      <Card padding>
        <CardTitle>{t('header.stat_unpaid_balance')}</CardTitle>
        <StatItem
          value={balance}
          subValue={tickerBalance ? `≈ ${tickerBalance}` : null}
        />
        {/* TODO: Test 100% balances */}
        <BalanceProgressBar
          value={balanceProgress}
          payoutInSeconds={amountToPayoutTimeInSeconds}
        />
      </Card>
      <Card padding>
        <CardTitle>
          {t('header.stat_estimate')}{' '}
          <EstimatedIntervalSwitch onClick={handleToggleEstimateInterval}>
            ({t(`header.stat_estimate_${estimateText}`)}){' '}
            <Tooltip icon={<CalendarIcon />}>
              <TooltipContent>
                {t('header.stat_estimate_tooltip')}
              </TooltipContent>
            </Tooltip>
          </EstimatedIntervalSwitch>
        </CardTitle>
        <StatItem
          value={estimated.ticker}
          subValue={estimated.counterTicker && <>≈ {estimated.counterTicker}</>}
        />
      </Card>
    </CardGrid>
  );
};
