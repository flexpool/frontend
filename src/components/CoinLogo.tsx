import React from 'react';
import { getCoinIconUrl } from 'src/utils/coin.utils';
import styled from 'styled-components';
const CoinImg = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
`;

export const CoinLogo: React.FC<{ ticker: string }> = ({ ticker }) => {
  const src = React.useMemo(() => {
    return getCoinIconUrl(ticker);
  }, [ticker]);

  return <CoinImg src={src} alt={`${ticker} Logo`} />;
};
