import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { CoinLogo } from 'src/components/CoinLogo';
import { Spacer } from 'src/components/layout/Spacer';
import styled from 'styled-components/macro';

import { mineableCoins } from './mineableCoinList';

const MineableCoinWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
`;
const Title = styled.h3``;

const MineableCoinGrid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const MineBtn = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: center;
  border: none;
  background: var(--border-color);
  border-radius: 0 0 5px 5px;
`;

const CoinContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MineableCoinList: React.FC = () => {
  return (
    <>
      <h1>Get started with mining on Flexpool today!</h1>
      <Spacer />
      <MineableCoinGrid>
        {mineableCoins.map((item) => (
          <MineableCoinWrapper>
            <CoinContent>
              <CoinLogo ticker={item.ticker} size="xl" />
              <Title>{item.name}</Title>
            </CoinContent>

            {item.hardware.map((itemHw) => (
              <MineBtn
                as={Link}
                to={`/get-started/${item.ticker}/${itemHw.key}`}
              >
                {itemHw.key} Mining Guide
              </MineBtn>
            ))}
          </MineableCoinWrapper>
        ))}
      </MineableCoinGrid>
    </>
  );
};
