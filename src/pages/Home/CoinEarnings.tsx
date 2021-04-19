import React from 'react';
import { FaDiscord, FaReddit, FaRocket, FaTelegram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Img } from 'src/components/Img';
import { Content } from 'src/components/layout/Content';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { DISCORD_LINK, REDDIT_LINK, TELEGRAM_LINK } from 'src/constants';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components/macro';

const UnknownCoin = styled.div`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background: var(--warning);
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    height: 45%;
    width: 45%;
  }
`;

const CoinIcon = styled(Img)`
  width: 60px;
  height: 60px;
`;

const EarningBox = styled.div`
  * {
    color: white;
  }
  background: rgba(255, 255, 255, 0.1);
  /* background: linear-gradient(
    -1450deg,
    rgba(2, 0, 36, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 100%
  ); */
  border-radius: 5px;
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Container = styled.div`
  display: flex;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const HeadContent = styled.div`
  margin-left: 1rem;
  p {
    margin-top: 0.25rem;
  }
`;
const HeadSplit = styled.div`
  display: flex;
  & > *:first-child {
    flex-shrink: 0;
  }
  & > *:last-child {
    margin-top: 0.25rem;
  }
  @media screen and (max-width: 540px) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    ${HeadContent} {
      margin-left: 0;
    }
  }
`;

const IntervalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-wrap: wrap;
  margin-left: -1rem;
  margin-right: -1rem;
  & > * {
    margin-left: 1rem;
    margin-right: 1rem;
    padding-top: 1.5rem;
  }
`;

const FiatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
`;
const IntervalItem = styled.div`
  p {
    margin-top: 0.25rem;
  }
  flex-grow: 1;
  @media screen and (max-width: 540px) {
    justify-content: center;
    text-align: center;
  }
`;

const StartMiningContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-grow: 1;
  @media screen and (max-width: 540px) {
    justify-content: center;
  }
  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

const PoolDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-grow: 1;
  text-align: right;
  @media screen and (max-width: 540px) {
    text-align: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: -0.5rem;
  & > * {
    margin: 0.5rem;
  }
`;
const Desc = styled.div`
  line-height: 1.4;
  margin-top: 0.5rem;
`;

const CoinEarningsItem: React.FC<{ data?: ApiPoolCoinFull }> = ({ data }) => {
  const counterTicker = useCounterTicker();
  const counterPrice = data?.marketData.prices[counterTicker] || 0;

  const dailyPer100 = data
    ? data.chainData.dailyRewardPerGigaHashSec /
      10 /
      Math.pow(10, data.decimalPlaces)
    : 0;
  const monthlyPer100 = dailyPer100 * 30.5;

  const monthlyCounterPrice = monthlyPer100 * counterPrice;
  const dailyCounterPrice = dailyPer100 * counterPrice;

  return (
    <EarningBox>
      <HeadSplit>
        {(data?.ticker && (
          <CoinIcon
            alt={data.ticker}
            src={getCoinIconUrl(data?.ticker, 'medium')}
          />
        )) || <UnknownCoin />}
        <HeadContent>
          <h2>{data ? data.name : <Skeleton />}</h2>
          <Desc>
            Estimated earnings{' '}
            <Tooltip>
              <TooltipContent>
                Estimated earnings are based on performance of mining last 7
                days on our pool.
              </TooltipContent>
            </Tooltip>
          </Desc>
        </HeadContent>
        {data?.ticker === 'eth' && (
          <PoolDetails>
            <p>
              0.5% Pool Fee
              <br />
              90% of MEV Bonus
            </p>
          </PoolDetails>
        )}
      </HeadSplit>
      <IntervalContainer>
        <IntervalItem>
          <p>100 MH/s daily</p>
          <FiatValue>
            {dailyCounterPrice ? (
              getDisplayCounterTickerValue(dailyCounterPrice, counterTicker)
            ) : (
              <Skeleton style={{ height: 25 }} />
            )}
          </FiatValue>
          <p>
            {dailyPer100 ? (
              <>{dailyPer100.toFixed(6)} ETH</>
            ) : (
              <Skeleton style={{ height: 10 }} />
            )}
          </p>
        </IntervalItem>
        <IntervalItem>
          <p>100 MH/s monthly</p>
          <FiatValue>
            {monthlyCounterPrice ? (
              getDisplayCounterTickerValue(monthlyCounterPrice, counterTicker)
            ) : (
              <Skeleton style={{ height: 25 }} />
            )}
          </FiatValue>
          <Desc>
            {monthlyPer100 ? (
              <>{monthlyPer100.toFixed(6)} ETH</>
            ) : (
              <Skeleton style={{ height: 10 }} />
            )}
          </Desc>
        </IntervalItem>
        {data?.ticker && (
          <StartMiningContainer>
            <Button
              variant="success"
              as={Link}
              to={`/get-started/${data?.ticker}`}
            >
              Start mining
            </Button>
          </StartMiningContainer>
        )}
      </IntervalContainer>
    </EarningBox>
  );
};

export const CoinEarnings = () => {
  const coinsFull = useReduxState('poolCoinsFull');

  const data = coinsFull.data || [];

  return (
    <Content>
      <Spacer size="xl" />
      <Container>
        {data.length > 0 ? (
          data.map((item) => <CoinEarningsItem key={item.ticker} data={item} />)
        ) : (
          <CoinEarningsItem />
        )}
        <EarningBox>
          <HeadSplit>
            {/* <CoinIcon src={getCoinIconSrc('zec')} /> */}
            <UnknownCoin>
              <FaRocket />
            </UnknownCoin>
            <HeadContent>
              <h2>More Coins Coming Soon!</h2>
              <p>
                We are working to launch multiple pools in the near future. Stay
                connected by joining our discord or telegram.
              </p>
            </HeadContent>
          </HeadSplit>
          <IntervalContainer>
            <StartMiningContainer>
              <ButtonGroup>
                <Button variant="danger" as={LinkOut} href={REDDIT_LINK}>
                  <FaReddit /> &nbsp; Reddit
                </Button>{' '}
                <Button variant="primary" as={LinkOut} href={TELEGRAM_LINK}>
                  <FaTelegram /> &nbsp; Telegram
                </Button>{' '}
                <Button variant="warning" as={LinkOut} href={DISCORD_LINK}>
                  <FaDiscord />
                  &nbsp;Discord
                </Button>
              </ButtonGroup>
            </StartMiningContainer>
          </IntervalContainer>
        </EarningBox>
      </Container>
    </Content>
  );
};
