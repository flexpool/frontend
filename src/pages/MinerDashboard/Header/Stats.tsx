import React, { useState } from 'react';

import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { useReduxState } from 'src/rdx/useReduxState';
import {
  useActiveCoin,
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import styled from 'styled-components/macro';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { StatItem } from 'src/components/StatItem';
import { useDailyRewardPerGhState } from 'src/hooks/useDailyRewardPerGhState';
import { poolStatsGet } from 'src/rdx/poolStats/poolStats.actions';
import { useDispatch } from 'react-redux';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { FaCalendar, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { dateUtils } from 'src/utils/date.utils';
import { addSeconds } from 'date-fns';
//

const EstimatedIntervalSwitch = styled.span`
  cursor: pointer;
  user-select: none;
  &:hover {
    color: var(--primary);
  }
`;

const ProgressBarWrapper = styled.div`
  margin-top: 8px;
  width: 100%;
  height: 8px;
  padding: 0px !important;
  background-color: var(--border-color);
  display: flex;
  border-radius: 0px 0px 4px 4px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const ProgressBar = styled.div`
  transition: 0.6s width cubic-bezier(0.35, 0.79, 0.37, 0.98);
  border-radius: 0px 0px 5px 5px;

  background-color: var(--primary);
`;

const ErrorText = styled.span`
  color: var(--danger);
`;
const SecondaryText = styled.span`
  color: var(--text-tertiary);
`;

const PayoutText = styled.p`
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
`;

const PayoutNumber = styled.span`
  color: var(--success);
`;

const BalanceProgressBar: React.FC<{
  value: number;
  payoutInSeconds: number;
}> = ({ value, payoutInSeconds }) => {
  const [progress, setProgress] = useState(0);
  React.useLayoutEffect(() => {
    setTimeout(() => {
      setProgress(Math.round(value));
    }, 100);
  }, [value]);
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
          <PayoutNumber>{progress}%</PayoutNumber> of the payout limit reached.
        </PayoutText>
        {payoutInSeconds && payoutInSeconds > 0 ? (
          <PayoutText>
            The limit will be reached{' '}
            <PayoutNumber>
              {dateUtils.formatDistance(
                addSeconds(new Date(), payoutInSeconds)
              )}
            </PayoutNumber>
            .
          </PayoutText>
        ) : (
          <PayoutText>
            Your payout will be processed on the next payment round if the fees
            match your preferences
          </PayoutText>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

type EstimateInterval = 1 | 7 | 30;

export const HeaderStats: React.FC<{
  coin?: ApiPoolCoin;
}> = ({ coin }) => {
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const minerDetailsState = useReduxState('minerDetails');
  const data = minerHeaderStatsState.data;
  const counterTicker = useCounterTicker();
  const activeTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  const settings = minerDetailsState.data;
  const d = useDispatch();
  const poolStatsState = useReduxState('poolStats');
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();

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
  const tickerBalance = getDisplayCounterTickerValue(
    data?.balanceCountervalue,
    counterTicker
  );

  const dailyRewardPerGhState = useDailyRewardPerGhState();

  const estimatedDailyEarnings =
    poolStatsState.data?.averageHashrate &&
    dailyRewardPerGhState.data &&
    minerHeaderStatsState.data?.roundShare
      ? (poolStatsState.data?.averageHashrate *
          dailyRewardPerGhState.data *
          minerHeaderStatsState.data?.roundShare) /
        1000000000
      : 0;
  const estimated = {
    ticker: estimatedDailyEarnings
      ? activeCoinFormatter(estimatedDailyEarnings * estimateInterval)
      : null,
    counterTicker:
      estimatedDailyEarnings && data?.countervaluePrice
        ? getDisplayCounterTickerValue(
            ((estimatedDailyEarnings * estimateInterval) /
              Math.pow(10, activeCoin?.decimalPlaces || 1000000000)) *
              data.countervaluePrice,
            counterTicker
          )
        : null,
  };

  const CalendarIcon =
    estimateInterval === 1
      ? FaCalendarDay
      : estimateInterval === 7
      ? FaCalendarWeek
      : FaCalendar;
  const estimateText =
    estimateInterval === 1
      ? 'daily'
      : estimateInterval === 7
      ? 'weekly'
      : 'monthly';

  const handleToggleEstimateInterval = () => {
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
  };

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
        <CardTitle>Workers Online/Offline</CardTitle>
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
        <CardTitle>Unpaid Balance</CardTitle>
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
          Estimated earnings{' '}
          <EstimatedIntervalSwitch onClick={handleToggleEstimateInterval}>
            ({estimateText}){' '}
            <Tooltip icon={<CalendarIcon />}>
              <TooltipContent>
                Click to change between daily, weekly and monthly estimate.
              </TooltipContent>
            </Tooltip>
          </EstimatedIntervalSwitch>
        </CardTitle>
        <StatItem
          value={estimated.ticker}
          subValue={estimated.counterTicker && <>≈ {estimated.counterTicker}</>}
        />
      </Card>
      {/* <Card padding>
        <CardTitle>Next Block Share</CardTitle>
        <StatItem
          value={
            data && `${Math.round(data.roundShare * 100 * 10000) / 10000}%`
          }
          subValue={<>Approximate Reward: {approximateBlockShare}</>}
        />
      </Card> */}
    </CardGrid>
  );
};
