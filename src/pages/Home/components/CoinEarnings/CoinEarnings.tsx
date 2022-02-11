import {
  UnknownCoin,
  CoinIcon,
  EarningBox,
  Container,
  HeadContent,
  HeadSplit,
  IntervalContainer,
  FiatValue,
  IntervalItem,
  StartMiningContainer,
  EstimatedNumbers,
  CryptoValue,
  PoolDetails,
  Desc,
} from './components';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Spacer } from 'src/components/layout/Spacer';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
  useLocalizedPercentFormatter,
} from 'src/utils/si.utils';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components';

import usePoolCoinsFullQuery from '@/hooks/api/usePoolCoinsFullQuery';
export const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY;

const CoinEarningsItem: React.FC<{ data?: ApiPoolCoinFull }> = ({ data }) => {
  const counterTicker = useCounterTicker();
  const counterPrice = data?.marketData.prices[counterTicker] || 0;

  var prefixMultiplier = 1;

  if (data?.defaultHashrateSiPrefix === 'k') {
    prefixMultiplier = 1000;
  } else if (data?.defaultHashrateSiPrefix === 'M') {
    prefixMultiplier = 1000000;
  } else if (data?.defaultHashrateSiPrefix === 'G') {
    prefixMultiplier = 1000000000;
  } else if (data?.defaultHashrateSiPrefix === 'T') {
    prefixMultiplier = 1000000000000;
  }

  const dailyPer100 = data
    ? (((data.chainData.dailyRewardPerGigaHashSec / 1000000000) *
        prefixMultiplier) /
        Math.pow(10, data.decimalPlaces)) *
      100
    : 0;
  const monthlyPer100 = dailyPer100 * 30.5;

  const monthlyCounterPrice = monthlyPer100 * counterPrice;
  const dailyCounterPrice = dailyPer100 * counterPrice;

  const { t } = useTranslation('home');
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const percentFormatter = useLocalizedPercentFormatter();
  const numberFormatter = useLocalizedNumberFormatter();

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
            {t('coin_earnings_cards.estimated')}{' '}
            <Tooltip>
              <TooltipContent>
                {t('coin_earnings_cards.estimated_tooltip')}
              </TooltipContent>
            </Tooltip>
          </Desc>
        </HeadContent>
      </HeadSplit>
      <IntervalContainer>
        <IntervalItem>
          <p>
            100 {data?.defaultHashrateSiPrefix}
            {data?.hashrateUnit} {t('coin_earnings_cards.daily')}
          </p>

          <EstimatedNumbers>
            <FiatValue>
              {dailyCounterPrice ? (
                currencyFormatter(dailyCounterPrice)
              ) : (
                <Skeleton style={{ height: 25 }} />
              )}
            </FiatValue>
            <CryptoValue>
              {dailyPer100 ? (
                <>
                  {'≈ '}
                  {numberFormatter(dailyPer100, {
                    maximumFractionDigits: 6,
                  })}{' '}
                  {data?.ticker.toUpperCase()}
                </>
              ) : (
                <Skeleton style={{ height: 10 }} />
              )}
            </CryptoValue>
          </EstimatedNumbers>
        </IntervalItem>
        <IntervalItem>
          <p>
            100 {data?.defaultHashrateSiPrefix}
            {data?.hashrateUnit} {t('coin_earnings_cards.monthly')}
          </p>

          <EstimatedNumbers>
            <FiatValue>
              {monthlyCounterPrice ? (
                currencyFormatter(monthlyCounterPrice)
              ) : (
                <Skeleton style={{ height: 25 }} />
              )}
            </FiatValue>
            <CryptoValue>
              {monthlyPer100 ? (
                <>
                  {'≈ '}
                  {numberFormatter(monthlyPer100, {
                    maximumFractionDigits: 6,
                  })}{' '}
                  {data?.ticker.toUpperCase()}
                </>
              ) : (
                <Skeleton style={{ height: 10 }} />
              )}
            </CryptoValue>
          </EstimatedNumbers>
        </IntervalItem>
      </IntervalContainer>
      {data?.ticker && (
        <StartMiningContainer>
          <PoolDetails>
            <p>
              {t('coin_earnings_cards.pool_fee', {
                value:
                  data?.ticker === 'eth' || data?.ticker === 'etc'
                    ? percentFormatter(5 / 1000)
                    : data?.ticker === 'xch'
                    ? percentFormatter(0 / 1000)
                    : data?.ticker === 'btc'
                    ? percentFormatter(1 / 1000)
                    : percentFormatter(10 / 1000),
              })}{' '}
              {(data?.ticker === 'eth' || data?.ticker === 'etc') && (
                <Tooltip>
                  <TooltipContent>
                    {t('coin_earnings_cards.mev', {
                      value: percentFormatter(0.9),
                    })}
                  </TooltipContent>
                </Tooltip>
              )}
              {data?.ticker === 'xch' && (
                <Tooltip>
                  <TooltipContent>
                    {t('coin_earnings_cards.finder_reward', {
                      value: `0.25 ${data?.ticker.toUpperCase()}`,
                    })}
                  </TooltipContent>
                </Tooltip>
              )}
            </p>
          </PoolDetails>

          <Link href={`/get-started/${data?.ticker}`} passHref>
            <Button variant="success">
              {data?.ticker === 'xch'
                ? t('coin_earnings_cards.cta_farm')
                : t('coin_earnings_cards.cta_mine')}
            </Button>
          </Link>
        </StartMiningContainer>
      )}
    </EarningBox>
  );
};

const FormContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  & > *:first-child {
    margin-right: 1rem;
    flex-grow: 1;
  }
`;

const ChiaBox = styled(EarningBox)`
  background: rgb(54, 173, 88);
  background: linear-gradient(
    135deg,
    rgba(54, 173, 88, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const ChiaCoin = styled(UnknownCoin)`
  height: 60px;
  width: 60px;
  background: white;
`;

export const CoinEarnings = () => {
  const { data: coinsFull } = usePoolCoinsFullQuery();

  return (
    <Content style={{ maxWidth: '1300px' }}>
      <Spacer size="xl" />
      <Container>
        {coinsFull ? (
          coinsFull
            .filter((item) => item.ticker !== 'btc')
            .map((item) => <CoinEarningsItem key={item.ticker} data={item} />)
        ) : (
          <>
            <CoinEarningsItem />
            <CoinEarningsItem />
            <CoinEarningsItem />
          </>
        )}
      </Container>
    </Content>
  );
};
