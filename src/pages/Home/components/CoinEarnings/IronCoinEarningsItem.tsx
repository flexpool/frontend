import Image from 'next/image';
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
import React, { useReducer } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button } from 'src/components/Button';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Spacer } from 'src/components/layout/Spacer';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { Checkbox } from '@/components/Form/Checkbox';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
  useLocalizedPercentFormatter,
} from 'src/utils/si.utils';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components';
import Badge from '@/components/Badge';
export const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY;

const DualMineCheckBoxWrapper = styled.div`
  min-height: 24px;

  label {
    align-items: center;
  }
`;

const DualMineCoinIcon = styled.div`
  margin: 0 6px;
`;

const DualMineCheckboxLabelContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const Uppercase = styled.span`
  text-transform: uppercase;
`;

const HeadWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const getCoinPoolFee = (coin: string) => {
  return coin === 'eth'
    ? 9 / 1000
    : coin === 'etc'
    ? 9 / 1000
    : coin === 'xch'
    ? 7 / 1000
    : coin === 'zil'
    ? 20 / 1000
    : coin === 'btc'
    ? 1 / 1000
    : coin === 'tiron'
    ? 0
    : coin === 'iron'
    ? 95 / 10000
    : 10 / 1000;
};
export const IronCoinEarningsItem: React.FC<{
  data?: ApiPoolCoinFull;
  dualMineCoin?: ApiPoolCoinFull;
}> = ({ data, dualMineCoin }) => {
  const [isDualMining, toggleDualMining] = useReducer((t) => !t, true);

  const counterTicker = useCounterTicker();

  const [dailyPer15, dailyCounterPrice] = getCoinEarnings(
    data,
    15,
    1,
    counterTicker
  );
  const [monthlyPer15, monthlyCounterPrice] = getCoinEarnings(
    data,
    15,
    30.5,
    counterTicker
  );

  const [dualMineMonthlyPer100, monthlyDualMineCounterPrice] = getCoinEarnings(
    dualMineCoin,
    100,
    30.5,
    counterTicker
  );
  const [dualMineDailyPer100, dailyDualMineCounterPrice] = getCoinEarnings(
    dualMineCoin,
    100,
    1,
    counterTicker
  );

  const calculatedDailyCounterPrice = isDualMining
    ? dailyCounterPrice + dailyDualMineCounterPrice
    : dailyCounterPrice;

  const calculatedMonthlyCounterPrice = isDualMining
    ? monthlyCounterPrice + monthlyDualMineCounterPrice
    : monthlyCounterPrice;

  const { t } = useTranslation('home');
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const percentFormatter = useLocalizedPercentFormatter();
  const numberFormatter = useLocalizedNumberFormatter();

  const renderDualMineCheckbox = (dualMineCoin) => {
    return (
      <DualMineCheckboxLabelContainer>
        {t('coin_earnings_cards.dual_mine')}{' '}
        <DualMineCoinIcon>
          <Image
            alt={`${dualMineCoin?.name} icon`}
            width={20}
            height={20}
            src={getCoinIconUrl(dualMineCoin?.ticker, 'small')}
          />
        </DualMineCoinIcon>{' '}
        <Uppercase>{dualMineCoin.ticker}</Uppercase> (+
        {percentFormatter(dailyDualMineCounterPrice / dailyCounterPrice)}{' '}
        {t('coin_earnings_cards.earnings')})
      </DualMineCheckboxLabelContainer>
    );
  };

  const renderPoolFee = (coin: string, dualMineCoin?: string) => {
    const dualMineBoost = dailyDualMineCounterPrice / dailyCounterPrice;

    // TODO: Reenable this back
    // const poolFee = dualMineCoin
    //   ? getCoinPoolFee(dualMineCoin) * dualMineBoost + getCoinPoolFee(coin)
    //   : getCoinPoolFee(coin);

    const poolFee = getCoinPoolFee(coin);

    return (
      <>
        {t('coin_earnings_cards.pool_fee', {
          value: percentFormatter(poolFee),
        })}{' '}
        {coin === 'eth' && (
          <Tooltip plus>
            <TooltipContent>
              {t('coin_earnings_cards.mev', {
                value: `+ ${percentFormatter(0.95)}`,
              })}
            </TooltipContent>
          </Tooltip>
        )}
        {coin === 'xch' && (
          <Tooltip plus>
            <TooltipContent>
              {t('coin_earnings_cards.finder_reward', {
                value: `+ 0.25 ${coin.toUpperCase()}`,
              })}
            </TooltipContent>
          </Tooltip>
        )}
      </>
    );
  };

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
          <h2>
            {data ? (
              <HeadWrapper>
                <span>{data.name}</span>
                {data.testnet && <Badge variant="warning">TESTNET</Badge>}
              </HeadWrapper>
            ) : (
              <Skeleton />
            )}
          </h2>
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
      <Spacer />
      <DualMineCheckBoxWrapper>
        {dualMineCoin && (
          <Checkbox
            label={renderDualMineCheckbox(dualMineCoin)}
            onChange={toggleDualMining}
            value={isDualMining as any}
          />
        )}
      </DualMineCheckBoxWrapper>
      <IntervalContainer>
        <IntervalItem>
          <p>
            15 {data?.defaultHashrateSiPrefix}
            {data?.hashrateUnit} {t('coin_earnings_cards.daily')}{' '}
            {isDualMining && (
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                }}
              >
                (with 100 MH/s for ZIL)
              </span>
            )}
          </p>

          {data?.testnet ? (
            <FiatValue>N/A</FiatValue>
          ) : (
            <EstimatedNumbers>
              <FiatValue>
                {calculatedDailyCounterPrice ? (
                  currencyFormatter(calculatedDailyCounterPrice)
                ) : (
                  <Skeleton style={{ height: 25 }} />
                )}
              </FiatValue>
              <CryptoValue>
                {dailyPer15 ? (
                  <>
                    {'≈ '}
                    {numberFormatter(dailyPer15, {
                      maximumFractionDigits: 5,
                    })}{' '}
                    {data?.ticker.toUpperCase()}
                    {dualMineCoin && isDualMining ? (
                      <>
                        {` + ${numberFormatter(dualMineDailyPer100, {
                          maximumFractionDigits: 2,
                        })} ${dualMineCoin?.ticker.toUpperCase()}`}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <Skeleton style={{ height: 10 }} />
                )}
              </CryptoValue>
            </EstimatedNumbers>
          )}
        </IntervalItem>
        <IntervalItem>
          <p>
            15 {data?.defaultHashrateSiPrefix}
            {data?.hashrateUnit} {t('coin_earnings_cards.monthly')}{' '}
            {isDualMining && (
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                }}
              >
                (with 100 MH/s for ZIL)
              </span>
            )}
          </p>

          {data?.testnet ? (
            <FiatValue>N/A</FiatValue>
          ) : (
            <EstimatedNumbers>
              <FiatValue>
                {calculatedMonthlyCounterPrice ? (
                  currencyFormatter(calculatedMonthlyCounterPrice)
                ) : (
                  <Skeleton style={{ height: 25 }} />
                )}
              </FiatValue>
              <CryptoValue>
                {monthlyPer15 ? (
                  <>
                    {'≈ '}
                    {numberFormatter(monthlyPer15, {
                      maximumFractionDigits: 5,
                    })}{' '}
                    {data?.ticker.toUpperCase()}
                    {dualMineCoin && isDualMining ? (
                      <>
                        {` + ${numberFormatter(dualMineMonthlyPer100, {
                          maximumFractionDigits: 2,
                        })} ${dualMineCoin?.ticker.toUpperCase()}`}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <Skeleton style={{ height: 10 }} />
                )}
              </CryptoValue>
            </EstimatedNumbers>
          )}
        </IntervalItem>
      </IntervalContainer>
      {data?.ticker && (
        <StartMiningContainer>
          <PoolDetails>
            <p>
              {renderPoolFee(
                data.ticker,
                dualMineCoin && isDualMining ? dualMineCoin.ticker : undefined
              )}
            </p>
          </PoolDetails>

          <Link href={`/get-started`} passHref>
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

function getDailyCoinEarnings(data: ApiPoolCoinFull, mh: number) {
  var prefixMultiplier = 1;

  if (data.defaultHashrateSiPrefix === 'k') {
    prefixMultiplier = 1000;
  } else if (data.defaultHashrateSiPrefix === 'M') {
    prefixMultiplier = 1000000;
  } else if (data.defaultHashrateSiPrefix === 'G') {
    prefixMultiplier = 1000000000;
  } else if (data.defaultHashrateSiPrefix === 'T') {
    prefixMultiplier = 1000000000000;
  }

  return (
    (((data.chainData.dailyRewardPerGigaHashSec / 1000000000) *
      prefixMultiplier) /
      Math.pow(10, data.decimalPlaces)) *
    mh
  );
}

const getEarningsForDays = (
  data: ApiPoolCoinFull,
  m: number,
  day: number,
  counterTicker: string,
  convertToCounterPrice?: boolean
) => {
  const earnings = getDailyCoinEarnings(data, m) * day;

  if (convertToCounterPrice) {
    const counterPrice = data?.marketData.prices
      ? data?.marketData.prices[counterTicker]
      : 0;

    return earnings * counterPrice;
  }

  return earnings;
};

const getCoinEarnings = (
  data: ApiPoolCoinFull | undefined,
  m: number,
  day: number,
  counterTicker: string
) => {
  if (data === undefined) {
    return [0, 0];
  }

  return [
    getEarningsForDays(data, m, day, counterTicker),
    getEarningsForDays(data, m, day, counterTicker, true),
  ];
};
