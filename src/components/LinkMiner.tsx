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
}> = ({ address, coin, chars }) => {
  return (
    <L to={{ pathname: `/miners/${coin}/${address}` }}>
      {stringUtils.shortenString(address, chars)}
    </L>
  );
};
