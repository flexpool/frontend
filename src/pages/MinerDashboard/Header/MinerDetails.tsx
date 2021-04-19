import React from 'react';
import { Card } from 'src/components/layout/Card';
import { Skeleton } from 'src/components/layout/Skeleton';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { useFeePayoutLimitDetails } from 'src/hooks/useFeePayoutDetails';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { dateUtils } from 'src/utils/date.utils';
//import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import styled from 'styled-components';

// type MinerRank = 'freeloader' | 'loyalminer' | 'vip' | 'mvp';
// const getRankColor = (rank: MinerRank) => {
//   switch (rank) {
//     case 'freeloader':
//       return 'var(--text-primary)';
//     case 'loyalminer':
//       return 'var(--success)';
//     case 'vip':
//       return 'var(--secondary)';
//     case 'mvp':
//       return 'var(--primary)';
//   }
// };

// const Rank = styled.span<{
//   rank: MinerRank;
// }>`
//   ${(p) => `
//     color: ${getRankColor(p.rank)}
//   `}
// `;

// const getRank = (value: number): [string, MinerRank] => {
//   const donation = value * 100;
//   if (donation === 0) return ['Freeloader', 'freeloader'];
//   else if (donation > 0 && donation <= 1) return ['Loyal Miner', 'loyalminer'];
//   else if (donation > 1 && donation < 5) return ['VIP', 'vip'];
//   else return ['MVP', 'mvp'];
// };

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
  const settings = minerDetailsState.data;
  const activeCoinTicker = useActiveCoinTicker();

  // const rank = React.useMemo(() => {
  //   if (settings) {
  //     return getRank(settings.poolDonation);
  //   }

  //   return null;
  // }, [settings]);

  const payoutLimit = useActiveCoinTickerDisplayValue(settings?.payoutLimit);
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const maxFeePrice = settings?.maxFeePrice;

  return (
    <Card paddingShort>
      <Content>
        {/* <Item>
          <div>Rank:&nbsp;</div>
          <div>
            {rank ? (
              <Rank rank={rank[1]}>{rank[0]}</Rank>
            ) : (
              <Skeleton width={80} />
            )}
          </div>
        </Item>
        <Item>
          <div>Pool Donation:&nbsp;</div>
          <div>
            {settings ? (
              settings.poolDonation * 100
            ) : (
              <>
                <Skeleton width={40} />{' '}
              </>
            )}
            %
          </div>
        </Item> */}
        <Item>
          <div>Payout Limit:&nbsp;</div>
          <div>{settings && coin ? payoutLimit : <Skeleton width={40} />}</div>
        </Item>
        {
        (maxFeePrice !== undefined) ? (
        <Item>
          <div>Gas Limit:&nbsp;</div>
          {maxFeePrice && feeDetails ?  <div>{maxFeePrice + " " + feeDetails.unit}</div> :
          <div>None Set&nbsp;&nbsp;
            {/*}<Tooltip>
              <TooltipContent
                message={'No gas limit has been set. The payment transaction will be executed when the payment limit is reached, regardless of current gas fees.'}
              />
            </Tooltip>*/}
          </div>}
        </Item>) : (
        <Item>
          <div>Gas Limit:&nbsp;</div>
          <div>{<Skeleton width={40} />}</div>
        </Item>)
        }
        <Item>
          <div>Joined:&nbsp;</div>
          <div>
            {settings ? (
              <>{dateUtils.formatDistance(settings.firstJoined * 1000)}</>
            ) : (
              <Skeleton width={50} />
            )}
          </div>
        </Item>
      </Content>
    </Card>
  );
};
