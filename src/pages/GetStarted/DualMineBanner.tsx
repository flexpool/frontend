import React from 'react';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Trans, useTranslation } from 'next-i18next';
import { FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { Content } from '@/components/layout/Content';
import { getCoinIconUrl } from '@/utils/staticImage.utils';
import { ApiPoolCoinFull } from '@/types/PoolCoin.types';
import usePoolCoinsFullQuery from '@/hooks/api/usePoolCoinsFullQuery';
import { useLocalizedPercentFormatter } from 'src/utils/si.utils';

const StyledCoin = styled.div`
  display: inline-block;
  height: 42px;
  width: 42px;
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
  position: relative;
  ${StyledCoin} + ${StyledCoin} {
    position: absolute;
    left: 26px;
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
  max-width: 410px;
  letter-spacing: -0.015em;

  margin-bottom: 14px;

  @media screen and (max-width: 768px) {
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const Description = styled.div`
  font-weight: 500;
  font-size: 15px;
  max-width: 500px;

  color: #cacaca;

  @media screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const BannerContentLayout = styled.div`
  display: flex;

  align-items: center;

  ${IconStack} {
    align-self: flex-start;
    margin-right: 42px;
  }

  ${CTA} {
    margin-left: auto;
  }

  @media screen and (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;

    ${CTA} {
      margin-left: 0;
      align-self: flex-start;
      margin-top: 20px;
    }
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

export const getDailyCoinEarningsPer100 = (
  coin: ApiPoolCoinFull | undefined,
  counterTicker: string
) => {
  var prefixMultiplier = 1;

  const counterPrice = coin?.marketData.prices
    ? coin?.marketData.prices[counterTicker]
    : 0;

  if (coin?.defaultHashrateSiPrefix === 'k') {
    prefixMultiplier = 1000;
  } else if (coin?.defaultHashrateSiPrefix === 'M') {
    prefixMultiplier = 1000000;
  } else if (coin?.defaultHashrateSiPrefix === 'G') {
    prefixMultiplier = 1000000000;
  } else if (coin?.defaultHashrateSiPrefix === 'T') {
    prefixMultiplier = 1000000000000;
  }

  const dailyPer100 = coin
    ? (((coin.chainData.dailyRewardPerGigaHashSec / 1000000000) *
        prefixMultiplier) /
        Math.pow(10, coin.decimalPlaces)) *
      100
    : 0;

  return dailyPer100 * counterPrice;
};

export const DualMineBanner = ({ primary, dual }: DualMineBannerProps) => {
  const { data } = usePoolCoinsFullQuery();
  const percentFormatter = useLocalizedPercentFormatter();
  const { t } = useTranslation('get-started');

  const primaryCoin = data?.find((coin) => coin.ticker === primary.ticker);
  const dualCoin = data?.find((coin) => coin.ticker === dual.ticker);

  const primaryEarnings = getDailyCoinEarningsPer100(primaryCoin, 'usd');
  const dualEarnings = getDailyCoinEarningsPer100(dualCoin, 'usd');

  const boostPercent = data
    ? percentFormatter(dualEarnings / primaryEarnings)
    : '-';

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
              <Trans
                t={t}
                i18nKey={'banner.dual_mine.p1'}
                values={{
                  primary_coin: primary.name,
                  dual_coin: dual.name,
                }}
                components={{
                  hl: <Highlight />,
                }}
              />
            </Headliner>

            <Description>
              <Trans
                t={t}
                i18nKey={'banner.dual_mine.p2'}
                values={{
                  primary_ticker: primary.ticker,
                  dual_ticker: dual.ticker,
                  boost_percent: boostPercent,
                }}
                components={{
                  hl: <Highlight />,
                }}
              />
            </Description>
          </div>

          <Link href="/get-started/zil/dual" passHref>
            <CTA id="learn_more_about_flexfarmer_cta">
              <Trans
                t={t}
                i18nKey={'banner.dual_mine.cta'}
                values={{
                  primary_ticker: primary.ticker,
                  dual_ticker: dual.ticker,
                }}
                components={{
                  up: <Uppercase />,
                }}
              />{' '}
              <FiChevronRight />
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
  padding: 20px 0;

  ${({ borderLocation }) =>
    css`border-${borderLocation}: 1px solid var(--border-color);`}

  & > div {
    height: 100%;
  }
`;
