import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const L = styled(Link)`
  font-weight: 500;
`;

const shortenString = (str: string, chars = 8) => {
  var charsStart = 10;
  if (str.startsWith('0x')) {
    charsStart = chars + 2;
  }
  return (
    str.substring(0, charsStart) +
    '…' +
    str.substring(str.length - chars, str.length)
  );
};

export const LinkMiner: React.FC<{
  address: string;
  coin: string;
  chars?: number;
}> = ({ address, coin, chars }) => {
  return (
    <L to={{ pathname: `/miners/${coin}/${address}` }}>
      {shortenString(address, chars)}
    </L>
  );
};
