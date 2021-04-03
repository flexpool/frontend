import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { CoinLogo } from 'src/components/CoinLogo';
import styled from 'styled-components/macro';

import { mineableCoins } from './mineableCoinList';

const MineableCoinWrapper = styled.div`
  padding: 2rem;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
`;
const Title = styled.h3``;

const MineableCoinGrid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
`;

export const MineableCoinList: React.FC = () => {
  return (
    <>
      <h1>Get started with mining today!</h1>
      <MineableCoinGrid>
        {mineableCoins.map((item) => (
          <MineableCoinWrapper>
            <CoinLogo ticker={item.ticker} size="xl" />
            <Title>{item.name}</Title>
            <div>
              {item.hardware.map((itemHw) => (
                <Button
                  as={Link}
                  to={`/get-started/${item.ticker}/${itemHw.key}`}
                >
                  {itemHw.key} Mining
                </Button>
              ))}
            </div>
          </MineableCoinWrapper>
        ))}
      </MineableCoinGrid>
    </>
  );
};
