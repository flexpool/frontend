import React, { useState } from 'react';

import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { useReduxState } from 'src/rdx/useReduxState';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import styled from 'styled-components/macro';
import { Card, CardGrid, CardTitle } from 'src/components/layout/Card';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { StatItem } from 'src/components/StatItem';
//

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

const BalanceProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const [progress, setProgress] = useState(0);
  React.useLayoutEffect(() => {
    setTimeout(() => {
      setProgress(value);
    }, 100);
  }, [value]);
  return (
    <ProgressBarWrapper>
      <ProgressBar style={{ width: `${progress}%` }}></ProgressBar>
    </ProgressBarWrapper>
  );
};

export const HeaderStats: React.FC<{
  coin?: ApiPoolCoin;
}> = ({ coin }) => {
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const minerDetailsState = useReduxState('minerDetails');
  const data = minerHeaderStatsState.data;
  const counterTicker = useCounterTicker();
  const settings = minerDetailsState.data;

  const approximateBlockShare = useActiveCoinTickerDisplayValue(
    data?.approximateBlockShare
  );
  const balance = useActiveCoinTickerDisplayValue(data?.balance);
  const tickerBalance = getDisplayCounterTickerValue(
    data?.balanceCountervalue,
    counterTicker
  );

  return (
    <CardGrid>
      <Card padding>
        <CardTitle>
          Workers <span style={{ fontWeight: 600 }}>Online</span>/
          <span className="accent" style={{ fontWeight: 600 }}>
            Offline
          </span>
        </CardTitle>
        <StatItem
          value={
            data ? (
              <>
                {data.workersOnline}/
                <span className="accent">{data.workersOffline}</span>
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
          value={
            settings && data
              ? data.balance / settings.payoutLimit > 1
                ? 100
                : (data.balance / settings.payoutLimit) * 100
              : 0
          }
        />
      </Card>
      <Card padding>
        <CardTitle>Next Block Share</CardTitle>
        <StatItem
          value={
            data &&
            `${Math.round(data.roundShare * 100 * 100000000) / 100000000}%`
          }
          subValue={<>Approximate Reward: {approximateBlockShare}</>}
        />
      </Card>
    </CardGrid>
  );
};
