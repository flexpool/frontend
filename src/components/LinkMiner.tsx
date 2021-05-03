import React from 'react';
import { Link } from 'react-router-dom';
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
}> = ({ address, coin, chars, className }) => {
  return (
    <L className={className} to={{ pathname: `/miner/${coin}/${address}` }}>
      {stringUtils.shortenString(address, chars)}
    </L>
  );
};
