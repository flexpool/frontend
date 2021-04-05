import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Card, CardBody } from 'src/components/layout/Card';
import { LinkOut } from 'src/components/LinkOut';
import { Highlight } from 'src/components/Typo/Typo';
import { getOsLogoUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components/macro';

import { mineableCoins } from './mineableCoinList';
import { MinerCommand } from './MinerCommand';
import { PingTest } from './PingTest';
import { SetWallet } from './SetWallet';

const MinerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    display: block;
  }
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

const SoftwareWrapper = styled.div`
  & > * {
    margin-bottom: 1rem;
  }
`;

const OsLogo = styled.img`
  height: 30px;
`;
const OsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  align-items: center;
  & > * {
    margin-left: 0.5rem;
  }
`;

export const MineableCoinGuidePage: React.FC = () => {
  const {
    params: { ticker, hw },
  } = useRouteMatch<{
    ticker?: string;
    hw?: string;
  }>();

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  const mineableCoinConfig = React.useMemo(() => {
    return mineableCoin?.hardware.find((item) => item.key === hw);
  }, [mineableCoin, hw]);

  if (!mineableCoin || !mineableCoinConfig) {
    return <Redirect to="/get-started" />;
  }

  return (
    <div>
      <h1>{mineableCoin.name} mining</h1>
      <SetWallet />
      {mineableCoin && <PingTest data={mineableCoin.regions} />}
      <h2>
        <Highlight>#3</Highlight> Choose your mining software
      </h2>
      <SoftwareWrapper>
        {mineableCoinConfig?.miners.map((miner) => (
          <Card>
            <CardBody>
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
                  <p>
                    <strong>Fee: </strong> <Fee fee={miner.fee} />
                  </p>
                </div>
                <OsContainer>
                  {miner.os.map((osItem) => (
                    <OsLogo
                      src={getOsLogoUrl(osItem)}
                      alt={`${osItem} logo`}
                      key={osItem}
                    />
                  ))}
                  <Button
                    shape="square"
                    variant="primary"
                    size="sm"
                    as={LinkOut}
                    href={miner.downloadLink}
                  >
                    <FaDownload />
                  </Button>
                </OsContainer>
              </MinerHeader>
            </CardBody>
            <MinerCommand command={miner.cmd} />
          </Card>
        ))}
      </SoftwareWrapper>
    </div>
  );
};
