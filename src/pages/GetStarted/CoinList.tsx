import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { CoinLogo } from 'src/components/CoinLogo';
import DynamicList from 'src/components/layout/List/List';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { Ws } from 'src/components/Typo/Typo';
import styled from 'styled-components/macro';

import { mineableCoins } from './mineableCoinList';

const MineableCoinWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  table td {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 0.875rem;
  }
`;
const Title = styled.h3``;

const MineableCoinGrid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 400px));
  gap: 1rem;
  width: 100%;

  .defWrap {
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: 2rem;
  }
`;

const CoinContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MineableCoinList: React.FC = () => {
  return (
    <Page>
      <h1>Get started with mining on Flexpool today!</h1>
      <Spacer />
      <MineableCoinGrid>
        {mineableCoins.map((item) => (
          <MineableCoinWrapper key={item.name}>
            <CoinContent>
              <CoinLogo ticker={item.ticker} size="xl" />
              <Title>{item.name}</Title>
            </CoinContent>

            {item.hardware.map((itemHw) => (
              <Button
                variant="primary"
                key={itemHw.key}
                as={Link}
                to={`/get-started/${item.ticker}/${itemHw.key}`}
              >
                {itemHw.key} Mining Guide
              </Button>
            ))}
            <DynamicList
              wrapperProps={{
                className: 'defWrap',
              }}
              hideHead
              data={item.poolDetails}
              columns={[
                {
                  title: '',
                  Component: ({ data }) => <>{data.key}</>,
                },
                {
                  title: '',
                  Component: ({ data }) => <Ws>{data.value}</Ws>,
                },
              ]}
            />
          </MineableCoinWrapper>
        ))}
      </MineableCoinGrid>
    </Page>
  );
};
