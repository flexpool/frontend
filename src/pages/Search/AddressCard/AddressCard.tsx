import React from 'react';
import { Card, CardTitle } from 'src/components/layout/Card';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { CoinLogo } from '@/components/CoinLogo';
import { Button } from '@/components/Button';
import usePoolCoinsQuery from '@/hooks/api/usePoolCoinsQuery';
import { Skeleton } from '@/components/layout/Skeleton';

const DashboardItemSkeleton = styled(Skeleton)`
  height: 36px;
  width: 158px;
`;

export const TickerName = styled.span`
  color: var(--text-tertiary);
`;

const CoinContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;

  & > * {
    margin-right: 0.5rem;
  }
`;

const StatusBadgeContainer = styled.div`
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
`;

export type AddressStatus = 'not-found' | 'pending' | 'mining';

const StatusIndicator = styled.div<{ status: AddressStatus }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  align-self: center;

  background-color: ${({ status }) => {
    switch (status) {
      case 'not-found':
        return 'var(--bad-luck-color)';
      case 'pending':
        return 'var(--warning)';
      case 'mining':
        return 'var(--success)';
    }
  }};

  margin-right: 4px;
`;

type StatusBadgeProps = {
  status: AddressStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let text = 'Pending';
  if (status === 'mining') {
    text = 'Mining';
  }
  if (status === 'not-found') {
    text = 'Not Found';
  }

  return (
    <StatusBadgeContainer>
      <StatusIndicator status={status} />
      <span>{text}</span>
    </StatusBadgeContainer>
  );
};

const ListItemContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ListItemEnd = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
`;

const ViewDashboardButton = styled(Button)`
  font-size: 12px;
`;

type DashboardListItemProps = { coin: string; name: string; address: string };

const StyledExternalLink = styled.a`
  color: var(--text-secondary);
  margin-left: 8px;
  padding-top: 4px;

  &:hover {
    color: var(--text-primary);
  }
`;

const DashboardExternalLink = ({
  coin,
  address,
}: {
  coin: string;
  address: string;
}) => {
  return (
    <StyledExternalLink href={`/miner/${coin}/${address}`} target="_blank">
      <HiOutlineExternalLink />
    </StyledExternalLink>
  );
};

const DashboardListItem = ({ coin, name, address }: DashboardListItemProps) => {
  const router = useRouter();

  return (
    <ListItemContainer>
      <CoinContainer>
        <CoinLogo ticker={coin} />
        <span>{name}</span>
        <TickerName>{coin.toUpperCase()}</TickerName>
      </CoinContainer>

      <ListItemEnd>
        <ViewDashboardButton
          variant="primary"
          size="xs"
          onClick={() => {
            router.push({
              pathname: `/miner/${coin}/${address}`,
            });
          }}
        >
          View Dashboard
        </ViewDashboardButton>

        <DashboardExternalLink address={address} coin={coin} />
      </ListItemEnd>
    </ListItemContainer>
  );
};

const DashboardList = styled.div`
  ${ListItemContainer}:not(:last-child) {
    padding-bottom: 12px;
  }

  ${ListItemContainer} + ${ListItemContainer} {
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
  }
`;

type AddressCardProps = {
  address: string;
  status: AddressStatus;
  dashboards: string[];
};

export const AddressCard = ({
  address,
  status,
  dashboards,
}: AddressCardProps) => {
  const { data: poolCoins, isLoading } = usePoolCoinsQuery({
    select: (data) => {
      const poolCoinsByTicker: {
        [key: string]: typeof data.coins[number];
      } = data.coins.reduce(
        (acc, coin) => ({
          ...acc,
          [coin.ticker]: coin,
        }),
        {}
      );

      return poolCoinsByTicker;
    },
  });

  const statusDescriptions: { [key in AddressStatus]: string } = {
    'not-found':
      'This address is not recognized by the pool. If you are new here, please check your connection with the pool.',
    pending:
      "Your address is discovered by the pool but we haven't received any shares. Please wait at least 10 minutes for your stats to be ready. In the mean time, please select your preferred dashboard.",
    mining: 'This address is currently mining with Flexpool.',
  };

  return (
    <Card padding>
      <CardTitle>Address</CardTitle>
      <p
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {address}
      </p>
      <CardTitle>
        Status <StatusBadge status={status} />
      </CardTitle>
      <p>{statusDescriptions[status]}</p>

      <CardTitle>Dashboards</CardTitle>
      <DashboardList>
        {isLoading && <DashboardItemSkeleton />}
        {poolCoins &&
          dashboards.map((coin) => {
            return (
              <DashboardListItem
                key={coin}
                coin={coin}
                name={poolCoins[coin].name}
                address={address}
              />
            );
          })}
        {dashboards.length === 0 && 'No dashboards found.'}
      </DashboardList>
    </Card>
  );
};

export default AddressCard;
