import React from 'react';
import { getCoinIconUrl } from 'src/utils/coin.utils';
import styled from 'styled-components';
const CoinImg = styled.img<{ size?: 'lg' }>`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;

  ${(p) =>
    p.size === 'lg' &&
    `
    height: 28px;
    width: 28px;
  `}
`;

export const CoinLogo: React.FC<{ ticker: string; size?: 'lg' }> = ({
  ticker,
  size,
}) => {
  const src = React.useMemo(() => {
    return getCoinIconUrl(ticker);
  }, [ticker]);

  return <CoinImg src={src} alt={`${ticker} Logo`} size={size} />;
};
