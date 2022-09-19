import React, { useState } from 'react';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import AnnouncementBar from '@/components/AnnouncementBar';
import { FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { Content } from '@/components/layout/Content';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';

const StyledCoin = styled.div`
  display: inline-block;
`;

const CoinIcon = ({ coin }: { coin: string }) => {
  return (
    <StyledCoin>
      <Image
        alt={`${coin} icon`}
        width={42}
        height={42}
        src={getCoinIconUrl(coin, 'small')}
      />
    </StyledCoin>
  );
};

const IconStack = styled.div`
  ${StyledCoin} + ${StyledCoin} {
    left: -12px;
    position: relative;
    z-index: -10;
  }
`;

const CTA = styled.a`
  color: white;
  padding: 8px 10px 8px 16px;
  display: inline-flex;
  align-items: center;
  white-space: pre;

  background-color: var(--primary);
  border-radius: 4px;

  transition: all 0.1s linear;

  svg {
    position: relative;
    left: 0;
    transition: left 0.2s linear;
  }

  &:hover {
    text-decoration: none;

    background-color: #1a79ff;

    svg {
      left: 3px;
    }
  }

  transition: color 0.1s linear;
`;

const Highlight = styled.span`
  font-weight: 700;
  color: white;
`;

const Uppercase = styled.span`
  text-transform: uppercase;
`;

const Headliner = styled.div`
  font-weight: 500;
  color: #cacaca;
  font-size: 24px;
  width: 410px;
  letter-spacing: -0.015em;

  margin-bottom: 14px;
`;

const Description = styled.div`
  font-weight: 500;
  font-size: 15px;
  width: 500px;

  color: #cacaca;
`;

const BannerContentLayout = styled.div`
  display: flex;

  align-items: center;

  ${IconStack} {
    align-self: flex-start;
    margin-right: 12px;
  }

  ${CTA} {
    margin-left: auto;
  }
`;

type Coin = {
  name: string;
  ticker: string;
};

type DualMineBannerProps = {
  primary: Coin;
  dual: Coin;
};

const GradientBackground = styled.div`
  position: absolute;
  left: -9.56%;
  right: 33.63%;
  top: 29.36%;
  bottom: 62.15%;
  height: 86px;
  z-index: -100;
  background: linear-gradient(
    115.2deg,
    #0069ff 2.49%,
    rgb(0 255 41 / 48%) 110.89%
  );
  filter: blur(200px);
  transform: matrix(1, 0, 0, 1, 0, 0);
`;

export const DualMineBanner = ({ primary, dual }: DualMineBannerProps) => {
  return (
    <StyledAnnouncementBar
      id="dual-mine-banner"
      borderLocation="top"
      removable={false}
    >
      <GradientBackground />
      <Content>
        <BannerContentLayout>
          <IconStack>
            <CoinIcon coin={primary.ticker} />
            <CoinIcon coin={dual.ticker} />
          </IconStack>

          <div>
            <Headliner>
              <Highlight>Boost your earnings</Highlight> by dual mining{' '}
              {primary.name} and {dual.name}
            </Headliner>

            <Description>
              We estimate a <Highlight>30.8%</Highlight> boost on your earnings,
              given current network conditions.
            </Description>
          </div>

          <Link href="/get-started/zil/dual" passHref>
            <CTA id="learn_more_about_flexfarmer_cta">
              Get started mining <Uppercase>{primary.ticker}</Uppercase> +{' '}
              <Uppercase>{dual.ticker}</Uppercase> <FiChevronRight />
            </CTA>
          </Link>
        </BannerContentLayout>
      </Content>
    </StyledAnnouncementBar>
  );
};

export default DualMineBanner;

const StyledAnnouncementBar = styled(AnnouncementBar)<{
  borderLocation: 'top' | 'bottom';
}>`
  position: relative;
  z-index: 0;
  background-color: #151519;
  text-align: left;
  position: relative;
  min-height: 180px;
  overflow: hidden;
  padding: 1rem 0;

  ${({ borderLocation }) =>
    css`border-${borderLocation}: 1px solid var(--border-color);`}

  & > div {
    height: 100%;
  }

  @media (max-width: 648px) {
    padding-bottom: 60px;
  }
`;
