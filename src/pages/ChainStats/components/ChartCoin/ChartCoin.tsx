import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Skeleton } from '@/components/layout/Skeleton';
import { getCoinIconUrl } from '@/utils/staticImage.utils';

const CoinImage = styled.div`
  height: 48px;
  width: 48px;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    height: 28px;
    width: 28px;
  }
`;

type CoinHeaderProps = {
  ticker: string | null | undefined;
  name: string | null | undefined;
};

const CoinName = styled.div`
  all: unset;
  margin-left: 10px;
  font-size: 36px;
  font-weight: 600;

  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const CoinTicker = styled.div`
  all: unset;
  text-transform: uppercase;
  margin-left: 10px;
  font-size: 36px;
  font-weight: 500;
  color: #4a4a4a;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const CoinHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CoinHeaderSkeleton = styled(Skeleton)`
  height: 48px;
  width: 260px;
`;

const NameContainer = styled.div`
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const ChartCoin = ({ ticker, name }: CoinHeaderProps) => {
  if (!ticker || !name) return <CoinHeaderSkeleton />;

  return (
    <CoinHeaderContainer>
      <CoinImage>
        <Image
          src={getCoinIconUrl(ticker)}
          alt={`${ticker} logo`}
          width={48}
          height={48}
        />
      </CoinImage>

      <NameContainer>
        <CoinName>{name}</CoinName>
        <CoinTicker>{ticker}</CoinTicker>
      </NameContainer>
    </CoinHeaderContainer>
  );
};

export default ChartCoin;
