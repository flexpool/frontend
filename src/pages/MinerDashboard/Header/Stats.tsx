import React from 'react';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import styled from 'styled-components';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import useMinerStatsQuery from '@/hooks/api/useMinerStatsQuery';
import useWorkerStatus from '@/hooks/useWorkerStatus';
import { StatItem } from 'src/components/StatItem';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import useMinerBalance from '@/hooks/useMinerBalance';
import usePoolDailyRewardPerGigahashSecQuery from '@/hooks/api/usePoolDailyRewardPerGigahashSecQuery';
import { FaCalendar, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useTranslation } from 'next-i18next';
import { useLocalizedCurrencyFormatter } from 'src/utils/si.utils';
import UnpaidBalance from './components/UnpaidBalance';

const EstimatedIntervalSwitch = styled.span`
  cursor: pointer;
  user-select: none;
  &:hover {
    color: var(--primary);
  }
`;

const ErrorText = styled.span`
  color: var(--danger);
`;
const SecondaryText = styled.span`
  color: var(--text-tertiary);
`;

type EstimateInterval = 1 | 7 | 30;

type HeaderStatsProps = {
  coin: string;
  address: string;
};

export const HeaderStats = ({ coin, address }: HeaderStatsProps) => {
  const { data: minerStatsState } = useMinerStatsQuery({ coin, address });
  const { data: dailyRewardsPerGh } = usePoolDailyRewardPerGigahashSecQuery({
    coin,
  });
  const { data: minerBalance } = useMinerBalance(address, coin);

  const activeCoin = useActiveCoin();
  const { data: workerStatus } = useWorkerStatus({ coin, address });

  const { t } = useTranslation('dashboard');
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const currencyFormatter = useLocalizedCurrencyFormatter();

  const [estimateInterval, setEstimateInterval] =
    useLocalStorageState<EstimateInterval>('estimateInterval', 1);

  const estimatedDailyEarnings = React.useMemo(() => {
    const rewards = dailyRewardsPerGh;
    const hashrate = minerStatsState?.averageEffectiveHashrate;

    if (rewards === undefined || hashrate === undefined) {
      return null;
    }

    return rewards * (hashrate / 1000000000);
  }, [dailyRewardsPerGh, minerStatsState]);

  const estimated = React.useMemo(() => {
    return {
      ticker:
        estimatedDailyEarnings !== null
          ? activeCoinFormatter(estimatedDailyEarnings * estimateInterval)
          : null,
      counterTicker:
        estimatedDailyEarnings !== null && minerBalance?.price
          ? currencyFormatter(
              ((estimatedDailyEarnings * estimateInterval) /
                Math.pow(10, activeCoin?.decimalPlaces || 9)) *
                minerBalance.price
            )
          : null,
    };
  }, [
    activeCoinFormatter,
    activeCoin?.decimalPlaces,
    currencyFormatter,
    estimateInterval,
    estimatedDailyEarnings,
    minerBalance,
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
      <UnpaidBalance coin={coin} address={address} />
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
