import React from 'react';
import Link from 'next/link';
import { stringUtils } from 'src/utils/string.utils';
import styled from 'styled-components';

const L = styled(Link)`
  font-weight: 500;
  white-space: nowrap;
`;

export const LinkMiner: React.FC<{
  address: string;
  coin: string;
  chars?: number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ address, coin, chars, className, onClick }) => {
  return (
    <L
      className={className}
      onClick={onClick}
      href={{ pathname: `/miner/${coin}/${address}` }}
    >
      {stringUtils.shortenString(address, chars)}
    </L>
  );
};
