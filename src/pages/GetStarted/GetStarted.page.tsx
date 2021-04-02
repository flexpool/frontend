import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { CoinLogo } from 'src/components/CoinLogo';
import { Card } from 'src/components/layout/Card';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { LinkOut } from 'src/components/LinkOut';
import styled from 'styled-components/macro';

import { mineableCoins } from './mineableCoinList';
import { PingTest } from './PingTest';

const MinerHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Fee: React.FC<{ fee: [number] | [number, number] }> = ({ fee }) => {
  console.log(fee);
  if (fee.length === 1) {
    return <>{fee[0]}%</>;
  }
  if (fee.length === 2) {
    return (
      <>
        {fee[0]}-{fee[1]}%
      </>
    );
  }
  return null;
};

const PlatformSticker = styled.span<{ gpu: 'NVIDIA' | 'AMD' | string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  display: inline-block;
  margin-left: 0.5rem;
  font-family: 'Roboto Mono';
  font-size: 0.875rem;
  ${(p) => {
    switch (p.gpu) {
      case 'AMD':
        return `
          background: #EF0707;
          color: var(--text-on-bg);
      `;
      case 'NVIDIA':
        return `
          background: #7ab547;
          color: var(--text-on-bg);
      `;
    }
  }}
`;

const MineableCoinPage: React.FC = () => {
  const {
    params: { ticker, hw },
  } = useRouteMatch<{
    ticker?: string;
    hw?: string;
  }>();

  console.log(ticker, hw);

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  const mineableCoinConfig = React.useMemo(() => {
    return mineableCoin?.hardware.find((item) => item.key === hw);
  }, [mineableCoin, hw]);

  return (
    <div>
      {mineableCoin && <PingTest data={mineableCoin.regions} />}
      <h2>Recommended mining software</h2>
      {mineableCoinConfig?.miners.map((miner) => (
        <Card padding>
          <MinerHeader>
            <div>
              <h3>
                {miner.title}{' '}
                {miner.compatibleGpus.map((gpu) => (
                  <PlatformSticker key={gpu} gpu={gpu.toUpperCase()}>
                    {gpu}
                  </PlatformSticker>
                ))}
              </h3>
              <p>{miner.description}</p>
            </div>
            <div>
              <Button
                variant="primary"
                size="sm"
                as={LinkOut}
                href={miner.downloadLink}
              >
                Download
              </Button>
            </div>
          </MinerHeader>
          <p>
            <strong>Fee: </strong> <Fee fee={miner.fee} />
          </p>
        </Card>
      ))}
    </div>
  );
};

const MineableCoinWrapper = styled.div``;
const Title = styled.h3``;

export const MineableCoinList: React.FC = () => {
  return (
    <>
      {mineableCoins.map((item) => (
        <MineableCoinWrapper>
          <CoinLogo ticker={item.ticker} size="lg" />
          <Title>{item.name}</Title>
          <div>
            {item.hardware.map((itemHw) => (
              <Button
                as={Link}
                to={`/get-started/${item.ticker}/${itemHw.key}`}
              >
                {itemHw.key}
              </Button>
            ))}
          </div>
        </MineableCoinWrapper>
      ))}
    </>
  );
};

export const GetStartedPage = () => {
  return (
    <Page>
      <Content>
        <h1>Get started</h1>
        <MineableCoinList />
        <MineableCoinPage />
      </Content>
    </Page>
  );
};
