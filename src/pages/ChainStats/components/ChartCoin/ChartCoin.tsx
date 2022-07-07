import React from 'react';
import styled from 'styled-components';
import { CoinLogo } from '@/components/CoinLogo';
import { Skeleton } from '@/components/layout/Skeleton';

type CoinHeaderProps = {
  ticker: string | null | undefined;
  name: string | null | undefined;
};

const CoinName = styled.h1`
  all: unset;
  margin-left: 10px;
  font-size: 36px;
  font-weight: 600;
`;

const CoinTicker = styled.h2`
  all: unset;
  text-transform: uppercase;
  margin-left: 10px;
  font-size: 36px;
  font-weight: 500;
  color: #4a4a4a;
`;

const CoinHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CoinHeaderSkeleton = styled(Skeleton)`
  height: 48px;
  width: 260px;
`;

export const ChartCoin = ({ ticker, name }: CoinHeaderProps) => {
  if (!ticker || !name) return <CoinHeaderSkeleton />;

  return (
    <CoinHeaderContainer>
      <CoinLogo size="xl" ticker={ticker} />

      <CoinName>{name}</CoinName>

      <CoinTicker>{ticker}</CoinTicker>
    </CoinHeaderContainer>
  );
};

export default ChartCoin;
