import React from 'react';
import { FaRocket } from 'react-icons/fa';
import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Spacer } from 'src/components/layout/Spacer';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
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

const CoinIcon = styled.img`
  width: 60px;
  height: 60px;
`;

const EarningBox = styled.div`
  * {
    color: white;
  }
  background: var(--bg-primary);
  background: linear-gradient(
    -1450deg,
    rgba(2, 0, 36, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 100%
  );
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

const FiatValue = styled.p`
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
        <CoinIcon src={getCoinIconUrl('eth')} />
        <HeadContent>
          <h2>{data ? data.name : <Skeleton />}</h2>
          <p>
            Estimated earnings{' '}
            <Tooltip>
              <TooltipContent>
                Estimated earnings are based on performance of mining last 100
                blocks on our pool.
              </TooltipContent>
            </Tooltip>
          </p>
        </HeadContent>
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
          <p>
            {monthlyPer100 ? (
              <>{monthlyPer100.toFixed(6)} ETH</>
            ) : (
              <Skeleton style={{ height: 10 }} />
            )}
          </p>
        </IntervalItem>
        <StartMiningContainer>
          <Button variant="success">Start mining</Button>
        </StartMiningContainer>
      </IntervalContainer>
    </EarningBox>
  );
};

export const CoinEarnings = () => {
  const coinsFull = useReduxState('poolCoinsFull');

  return (
    <Content>
      <Spacer size="xl" />
      <Container>
        {coinsFull.data.length > 0 ? (
          coinsFull.data.map((item) => (
            <CoinEarningsItem key={item.ticker} data={item} />
          ))
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
              <h2>More coins to mine soon!</h2>
              <p>
                We are preparing to launch multiple pools in the nearest future.
                Stay connected with us to be there when the next altcoin hits
                Flexppol!
              </p>
            </HeadContent>
          </HeadSplit>
          <IntervalContainer>
            <StartMiningContainer>
              <Button variant="warning">Join Our Discord</Button>
            </StartMiningContainer>
          </IntervalContainer>
        </EarningBox>
      </Container>
    </Content>
  );
};
