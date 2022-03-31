import React, { useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { isNil } from 'lodash';
import { addSeconds } from 'date-fns';
import { Card, CardTitle } from '@/components/layout/Card';
import { StatItem } from '@/components/StatItem';
import { Tooltip, TooltipContent } from '@/components/Tooltip';
import useActiveCoinNetworkFee from '@/hooks/useActiveCoinNetworkFee';
import useMinerBalance from '@/hooks/useMinerBalance';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from '@/utils/si.utils';
import { useLocalizedDateFormatter } from '@/utils/date.utils';
import { useLocalizedActiveCoinValueFormatter } from '@/hooks/useDisplayReward';
import useMinerDetailsQuery from '@/hooks/api/useMinerDetailsQuery';
import usePoolDailyRewardPerGigahashSecQuery from '@/hooks/api/usePoolDailyRewardPerGigahashSecQuery';
import useMinerStatsQuery from '@/hooks/api/useMinerStatsQuery';

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

const BalanceProgressBar: React.FC<{
  value: number;
  coin: string;
  address: string;
  payoutInSeconds: number;
  isMainnet: boolean;
  networkFeeLimit?: number;
}> = ({
  value,
  coin,
  address,
  payoutInSeconds,
  isMainnet,
  networkFeeLimit,
}) => {
  const [progress, setProgress] = useState(0);
  React.useEffect(() => {
    setTimeout(() => {
      setProgress(value);
    }, 100);
  }, [value]);

  const { t } = useTranslation('dashboard');
  const numberFormatter = useLocalizedNumberFormatter();
  const dateFormatter = useLocalizedDateFormatter();
  const currentNetworkFee = useActiveCoinNetworkFee(coin, address);
  const isPayoutDelayedByNetworkFee = React.useMemo(() => {
    return (
      // Gas fee is only considered for mainnet
      isMainnet &&
      !isNil(currentNetworkFee) &&
      !isNil(networkFeeLimit) &&
      networkFeeLimit > 0 &&
      currentNetworkFee > networkFeeLimit
    );
  }, [isMainnet, currentNetworkFee, networkFeeLimit]);

  const status = React.useMemo(() => {
    if (progress === 100) {
      if (isPayoutDelayedByNetworkFee) {
        return 'warning';
      } else {
        return 'success';
      }
    }
    return 'primary';
  }, [progress, isPayoutDelayedByNetworkFee]);

  const renderPayoutToolTip = React.useCallback(() => {
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
      if (isPayoutDelayedByNetworkFee) {
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

      if (isMainnet) {
        return (
          <PayoutText>{t('header.stat_unpaid_balance_reach_ok')}</PayoutText>
        );
      }

      return (
        <PayoutText>{t('header.stat_unpaid_balance_reach_ok_l2')}</PayoutText>
      );
    }
  }, [
    isMainnet,
    isPayoutDelayedByNetworkFee,
    payoutInSeconds,
    currentNetworkFee,
    networkFeeLimit,
    dateFormatter,
    t,
  ]);

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

type UnpaidBalanceProps = {
  coin: string;
  address: string;
};

const UnpaidBalance = ({ coin, address }: UnpaidBalanceProps) => {
  const { t } = useTranslation('dashboard');
  const { data: minerStatsState } = useMinerStatsQuery({ coin, address });
  const { data: minerBalance } = useMinerBalance(address, coin);
  const { data: minerDetails } = useMinerDetailsQuery({
    coin,
    address,
  });
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const { data: dailyRewardsPerGh } = usePoolDailyRewardPerGigahashSecQuery({
    coin,
  });
  const balance = activeCoinFormatter(minerBalance?.balance, {
    maximumFractionDigits: 6,
  });
  const currencyFormatter = useLocalizedCurrencyFormatter();

  const tickerBalance = currencyFormatter(
    minerBalance?.balanceCountervalue || 0
  );

  const estimatedDailyEarnings = React.useMemo(() => {
    const rewards = dailyRewardsPerGh;
    const hashrate = minerStatsState?.averageEffectiveHashrate;

    if (rewards === undefined || hashrate === undefined) {
      return null;
    }

    return rewards * (hashrate / 1000000000);
  }, [dailyRewardsPerGh, minerStatsState]);

  const balanceProgress =
    minerDetails && minerBalance
      ? minerBalance.balance / minerDetails.payoutLimit > 1
        ? 100
        : (minerBalance.balance / minerDetails.payoutLimit) * 100
      : null;

  const estimatedEarningsPerSecond =
    estimatedDailyEarnings !== null
      ? estimatedDailyEarnings / 24 / 60 / 60
      : null;

  const amountToPayout =
    minerDetails && minerBalance
      ? minerDetails.payoutLimit - minerBalance.balance
      : 0;

  const amountToPayoutTimeInSeconds =
    estimatedEarningsPerSecond !== null
      ? amountToPayout / estimatedEarningsPerSecond
      : 0;

  return (
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
          networkFeeLimit={minerDetails?.maxFeePrice}
          coin={coin}
          address={address}
          payoutInSeconds={amountToPayoutTimeInSeconds}
          isMainnet={minerDetails?.network === 'mainnet'}
        />
      ) : (
        <ProgressBarWrapper />
      )}
    </Card>
  );
};

export default UnpaidBalance;
