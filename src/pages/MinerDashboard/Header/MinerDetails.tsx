import React from 'react';
import { Card } from 'src/components/layout/Card';
import { Skeleton } from 'src/components/layout/Skeleton';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { dateUtils } from 'src/utils/date.utils';
import styled from 'styled-components';

type MinerRank = 'freeloader' | 'loyalminer' | 'vip' | 'mvp';
const getRankColor = (rank: MinerRank) => {
  switch (rank) {
    case 'freeloader':
      return 'var(--text-primary)';
    case 'loyalminer':
      return 'var(--success)';
    case 'vip':
      return 'var(--secondary)';
    case 'mvp':
      return 'var(--primary)';
  }
};

const Rank = styled.span<{
  rank: MinerRank;
}>`
  ${(p) => `
    color: ${getRankColor(p.rank)}
  `}
`;

const getRank = (value: number): [string, MinerRank] => {
  const donation = value * 100;
  if (donation === 0) return ['Freeloader', 'freeloader'];
  else if (donation > 0 && donation <= 1) return ['Loyal Miner', 'loyalminer'];
  else if (donation > 1 && donation < 5) return ['VIP', 'vip'];
  else return ['MVP', 'mvp'];
};

const Wrap = styled(Card)`
  display: flex;
  margin-top: 1rem;
  padding: 1rem;
`;

const Item = styled.div`
  display: flex;
  font-weight: 600;
  margin-right: 2rem;
  @media screen and (max-width: 920px) {
    display: block;
  }
`;

export const MinerDetails: React.FC<{
  coin?: ApiPoolCoin;
}> = ({ coin }) => {
  const minerDetailsState = useReduxState('minerDetails');
  const settings = minerDetailsState.data;

  const rank = React.useMemo(() => {
    if (settings) {
      return getRank(settings.poolDonation);
    }

    return null;
  }, [settings]);

  const payoutLimit = useActiveCoinTickerDisplayValue(settings?.payoutLimit);

  return (
    <Wrap paddingShort>
      <Item>
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
      </Item>
      <Item>
        <div>Payout Limit:&nbsp;</div>
        <div>{settings && coin ? payoutLimit : <Skeleton width={40} />}</div>
      </Item>
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
    </Wrap>
  );
};
