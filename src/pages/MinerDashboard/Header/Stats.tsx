import React, { useState, useMemo } from 'react';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { useReduxState } from 'src/rdx/useReduxState';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import styled from 'styled-components';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useNetworkFeeLimit } from '@/rdx/minerDetails/minerDetails.selectors';
import useActiveCoinNetworkFee from '@/hooks/useActiveCoinNetworkFee';
import { useMinerWorkersStatus } from '@/rdx/minerWorkers/minerWorkers.hooks';
import { StatItem } from 'src/components/StatItem';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { FaCalendar, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import { addSeconds } from 'date-fns';
import { Trans, useTranslation } from 'next-i18next';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import { isNil } from 'lodash';

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
  overflow: hidden;
`;

type ProgressBarProps = {
  width: number;
  status: string;
};

const ProgressBar = styled.div<ProgressBarProps>`
  transition: 0.6s width cubic-bezier(0.35, 0.79, 0.37, 0.98);

  width: ${(p) => `${p.width}%`};
  background-color: ${(p) => `var(--${p.status})`};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: ${(p) => `var(--${p.status})`};
    width: ${(p) => `${p.width}%`};
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.075) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.075) 50%,
      rgba(255, 255, 255, 0.075) 75%,
      transparent 75%,
      transparent
    );
    z-index: 1;
    background-size: 50px 50px;
    animation: move 5s linear infinite;
    overflow: hidden;

    @keyframes move {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 50px 50px;
      }
    }
  }
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

const GasWarning = styled.span`
  color: var(--warning);
`;

const BalanceProgressBar: React.FC<{
  value: number;
  payoutInSeconds: number;
}> = ({ value, payoutInSeconds }) => {
  const [progress, setProgress] = useState(0);
  React.useEffect(() => {
    setTimeout(() => {
      setProgress(value);
    }, 100);
  }, [value]);

  const { t } = useTranslation('dashboard');
  const numberFormatter = useLocalizedNumberFormatter();
  const dateFormatter = useLocalizedDateFormatter();

  const currentNetworkFee = useActiveCoinNetworkFee();
  const networkFeeLimit = useNetworkFeeLimit();

  const status = React.useMemo(() => {
    if (progress === 100) {
      if (
        !isNil(networkFeeLimit) &&
        !isNil(currentNetworkFee) &&
        currentNetworkFee > networkFeeLimit
      ) {
        return 'warning';
      } else {
        return 'success';
      }
    }
    return 'primary';
  }, [progress, networkFeeLimit, currentNetworkFee]);

  const renderPayoutToolTip = React.useCallback(() => {
    const delayedByNetworkFee =
      !isNil(currentNetworkFee) &&
      !isNil(networkFeeLimit) &&
      currentNetworkFee > networkFeeLimit;

    if (payoutInSeconds && payoutInSeconds > 0) {
      return (
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
      );
    } else {
      if (delayedByNetworkFee) {
        return (
          <PayoutText>
            <Trans
              i18nKey="header.stat_unpaid_balance_reach_delayed_by_gas_limit"
              ns="dashboard"
              values={{
                gasLimit: networkFeeLimit,
                currentGas: currentNetworkFee,
              }}
              components={{
                v: <GasWarning />,
              }}
            />
          </PayoutText>
        );
      }
      return (
        <PayoutText>{t('header.stat_unpaid_balance_reach_ok')}</PayoutText>
      );
    }
  }, [payoutInSeconds, currentNetworkFee, networkFeeLimit, dateFormatter, t]);

  return (
    <Tooltip
      wrapIcon={false}
      placement="bottom"
      icon={
        <ProgressBarWrapper>
          <ProgressBar width={progress || 0} status={status} />
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
        {renderPayoutToolTip()}
      </TooltipContent>
    </Tooltip>
  );
};

type EstimateInterval = 1 | 7 | 30;

export const HeaderStats = () => {
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const minerDetailsState = useReduxState('minerDetails');
  const minerStatsState = useReduxState('minerStats');
  const activeCoin = useActiveCoin();
  const workerStatus = useMinerWorkersStatus();
  const data = minerHeaderStatsState.data;
  const settings = minerDetailsState.data;

  const { t } = useTranslation('dashboard');
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const currencyFormatter = useLocalizedCurrencyFormatter();

  const [estimateInterval, setEstimateInterval] =
    useLocalStorageState<EstimateInterval>('estimateInterval', 1);

  const balance = activeCoinFormatter(data?.balance, {
    maximumFractionDigits: 6,
  });

  const tickerBalance = currencyFormatter(data?.balanceCountervalue || 0);

  const estimatedDailyEarnings = React.useMemo(() => {
    return minerHeaderStatsState.data?.dailyRewardsPerGh &&
      minerStatsState.data?.averageEffectiveHashrate
      ? minerHeaderStatsState.data?.dailyRewardsPerGh *
          (minerStatsState.data?.averageEffectiveHashrate / 1000000000)
      : 0;
  }, [minerHeaderStatsState.data, minerStatsState.data]);

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
      : null;

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
            workerStatus ? (
              <>
                {workerStatus.online}
                {'/'}
                {workerStatus.offline > 0 ? (
                  <ErrorText>{workerStatus.offline}</ErrorText>
                ) : (
                  <SecondaryText>{workerStatus.offline}</SecondaryText>
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
        {balanceProgress !== null ? (
          <BalanceProgressBar
            value={balanceProgress}
            payoutInSeconds={amountToPayoutTimeInSeconds}
          />
        ) : (
          <ProgressBarWrapper />
        )}
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
