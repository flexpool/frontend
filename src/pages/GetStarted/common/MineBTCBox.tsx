import { Img } from '@/components/Img';
import { getCoinIconUrl } from '@/utils/staticImage.utils';
import React from 'react';
import styled from 'styled-components';

interface MineBTCBoxProps {}

export const MineBTCBox: React.FC<MineBTCBoxProps> = ({ children }) => {
  return (
    <MineBTCWrapper>
      <MineBTC>
        <BTCImg src={getCoinIconUrl('btc')} alt={`btc logo`} height={35} />
        {children}
      </MineBTC>
    </MineBTCWrapper>
  );
};

const MineBTC = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  padding: 10px;
  border-radius: 15px;

  border: 2px solid black;
`;

const MineBTCWrapper = styled.div`
  display: flex;
`;

const BTCImg = styled(Img)`
  margin-right: 10px;
`;

const MineBTCTCText = styled.p`
  font-size: 12px;
`;
