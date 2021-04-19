import React from 'react';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components';
import { Img } from './Img';

type CoinSize = 'lg' | 'xl';
const CoinImg = styled(Img)<{ size?: CoinSize }>`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;

  ${(p) => {
    switch (p.size) {
      case 'lg':
        return `
          height: 28px;
          width: 28px;
        `;
      case 'xl':
        return `
          height: 48px;
          width: 48px;
        `;
    }
  }}
`;

export const CoinLogo: React.FC<{ ticker: string; size?: CoinSize }> = ({
  ticker,
  size,
}) => {
  const src = React.useMemo(() => {
    return getCoinIconUrl(ticker);
  }, [ticker]);

  return <CoinImg src={src} alt={`${ticker} Logo`} size={size} />;
};
