import React from 'react';
import { Card } from 'src/components/layout/Card';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useFeePayoutLimitDetails } from 'src/hooks/useFeePayoutDetails';
import {
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { dateUtils } from 'src/utils/date.utils';
import styled from 'styled-components';

const NoFeeLimit = styled.div`
  color: var(--text-secondary);
`;

const Item = styled.div`
  display: flex;
  font-weight: 600;
  margin-right: 2rem;
  white-space: nowrap;
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media screen and (max-width: 900px) {
    margin-top: -0.5rem;
    ${Item} {
      margin-top: 0.5rem;
      flex-grow: 1;
      flex-shrink: 0;
      margin-right: 1rem;
      display: block;
    }
  }
  @media screen and (max-width: 500px) {
    margin-top: -0.5rem;
    ${Item} {
      width: calc(50% - 2rem);
    }
  }
`;
export const MinerDetails: React.FC<{
  coin?: ApiPoolCoin;
}> = ({ coin }) => {
  const minerDetailsState = useReduxState('minerDetails');
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const settings = minerDetailsState.data;
  const activeCoinTicker = useActiveCoinTicker();
  const payoutLimit = activeCoinFormatter(settings?.payoutLimit);
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const maxFeePrice = settings?.maxFeePrice;
  const counterTicker = useCounterTicker();

  const counterValuePrice = getDisplayCounterTickerValue(
    minerHeaderStatsState.data?.countervaluePrice,
    counterTicker
  );

  return (
    <Card paddingShort>
      <Content>
        <Item>
          <div>Payout Limit:&nbsp;</div>
          <div>{settings && coin ? payoutLimit : <Skeleton width={40} />}</div>
        </Item>
        <Item>
          <div>
            {feeDetails ? feeDetails?.title : <Skeleton width={10} />}{' '}
            Limit:&nbsp;
          </div>
          {maxFeePrice && feeDetails ? (
            <div>{maxFeePrice + ' ' + feeDetails?.unit}</div>
          ) : (
            <NoFeeLimit>
              {maxFeePrice === 0 ? 'None' : <Skeleton width={40} />}
            </NoFeeLimit>
          )}
        </Item>
        {settings &&
          !!settings.firstJoined && ( // will be hidden if unix timestamp is zero
            <Tooltip
              wrapIcon={false}
              icon={
                <Item>
                  <div>Joined:&nbsp;</div>
                  <div>
                    {settings ? (
                      <>
                        {dateUtils.formatDistance(settings.firstJoined * 1000)}
                      </>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </div>
                </Item>
              }
            >
              <TooltipContent>
                <p>
                  <strong>
                    Your first share has been recorded on{' '}
                    {dateUtils.format(settings.firstJoined * 1000, 'PPp')}
                  </strong>
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        <Item>
          <div>{coin?.name} Price:&nbsp;</div>
          <div>{counterValuePrice || <Skeleton width={40} />}</div>
        </Item>
      </Content>
    </Card>
  );
};
