import {
  CoinIcon,
  EarningBox,
  HeadContent,
  HeadSplit,
  StartMiningContainer,
  PoolDetails,
  Desc,
} from './components';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from 'src/components/Button';
import { Spacer } from 'src/components/layout/Spacer';

import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components';
import Link from 'next/link';

const GradientBlueText = styled.span`
  background: linear-gradient(
    90deg,
    rgb(37, 47, 255) -100%,
    rgb(37, 106, 243) -50%,
    rgb(124, 192, 226) 0%,
    rgb(37, 106, 243) 50%,
    rgb(37, 47, 255) 100%
  );

  display: inline-block;

  background-clip: text;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const IronFishLaunch: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <EarningBox>
      <HeadSplit>
        <CoinIcon alt={'xch'} src={getCoinIconUrl('iron', 'medium')} />

        <HeadContent>
          <h2>Iron Fish</h2>
          <Desc
            style={{
              visibility: 'hidden',
            }}
          >
            -
          </Desc>
        </HeadContent>
      </HeadSplit>

      <Spacer size="lg" />
      <Spacer size="lg" />
      <Spacer size="md" />

      <div
        style={{
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            letterSpacing: '-0.15%',
            fontSize: '32px',
          }}
        >
          Coming soon
        </div>
        <Spacer size="md" />
        <div
          style={{
            fontWeight: 600,
            fontSize: '22px',
          }}
        >
          <GradientBlueText>April 20th</GradientBlueText>
        </div>
      </div>

      <Spacer size="lg" />
      <Spacer size="lg" />

      <StartMiningContainer>
        <PoolDetails></PoolDetails>
        <Link href={`/get-started`} passHref>
          <Button variant="success">Try Testnet</Button>
        </Link>
      </StartMiningContainer>
    </EarningBox>
  );
};
