import React, { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Card } from '@/components/layout/Card';
import Modal from '@/components/Modal/Modal';
import Stack from '@/components/Stack';
import { getCoinIconUrl } from '@/utils/staticImage.utils';
import { ScrollArea } from '@/components/layout/ScrollArea';
import { Spacer } from '@/components/layout/Spacer';
import usePoolDailyRewardPerGigahashSecQuery from '@/hooks/api/usePoolDailyRewardPerGigahashSecQuery';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedPercentFormatter,
} from '@/utils/si.utils';
import { useLocalizedCoinValueFormatter } from 'src/hooks/useDisplayReward';
import useMinerStatsQuery from '@/hooks/api/useMinerStatsQuery';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import usePoolCoinsFullQuery from '@/hooks/api/usePoolCoinsFullQuery';
import { FiArrowUp } from 'react-icons/fi';
import { DurationPicker } from './DurationPicker';
import { getDailyCoinEarningsPer100 } from '@/pages/GetStarted/DualMineBanner';
import { FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { Trans, useTranslation } from 'next-i18next';

const Description = styled.div`
  font-weight: 400;
  font-size: 16px;
  width: 90%;
  color: var(--text-secondary);

  @media screen and (min-width: 768px) {
    width: 60%;
  }
`;

const EarningsCoin = styled.div`
  color: var(--text-secondary);
  font-size: 13px;

  span {
    color: var(--text-secondary) !important;
  }

  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const EarningsFiat = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin: 4px 0px 4px 0px;

  @media screen and (min-width: 768px) {
    font-size: 32px;
  }
`;

const EarningsTitle = styled.div`
  color: var(--text-tertiary);
  font-size: 10px;

  @media screen and (min-width: 768px) {
    font-size: 12px;
  }
`;

const StyledCoin = styled.div`
  display: inline-block;
  height: 15px;
  width: 15px;
`;

const InlineStack = styled(Stack)`
  display: inline-flex;
`;

const IconStack = styled(Stack)`
  position: relative;
  margin-right: 6px;

  ${StyledCoin} + ${StyledCoin} {
    position: absolute;
    z-index: -10;
  }
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

const Text = styled.div`
  font-weight: 600;
  font-size: 12px;
  margin-right: 12px;
  flex-shrink: 1;
`;

const Highlight = styled.span`
  font-size: 14px;
`;

const CTA = styled.a`
  color: white;
  display: inline-block;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  white-space: pre;
  background-color: var(--primary);
  border-radius: 5px;
  font-size: 12px;
  flex-shrink: 1;
  padding: 5px 12px;

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

const Heading = styled.div`
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 24px;
`;

const ComparisonSection = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const TrapezoidHeader = styled.div<{ accent: string }>`
  background: ${(p) => p.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  min-width: 100px;
  position: absolute;
  top: 0;
  padding: 8px;
  width: 45%;
  height: 34px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: 14px;
  z-index: 0;
  white-space: pre;

  &:before {
    content: ' ';
    display: block;
    background: ${(p) => p.accent};
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -10px;
    transform: skew(10deg);
    border-bottom-left-radius: 5px;
    z-index: -1;
  }

  &:after {
    content: ' ';
    display: block;
    background: ${(p) => p.accent};
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    right: -10px;
    transform: skew(-10deg);
    border-bottom-right-radius: 5px;
    z-index: -1;
  }
`;

const StyledEarningsCard = styled.div<{ accent: string }>`
  width: 100%;
  border: 1px solid ${(p) => p.accent};
  border-radius: 5px;
  text-align: center;
  position: relative;

  padding: 50px 8px 20px 8px;

  @media screen and (min-width: 768px) {
    width: 265px;
  }
`;

type EarningsCardProps = {
  title: string;
  children: React.ReactNode;
  accent: string;
};
const EarningsCard = ({ title, children, accent }: EarningsCardProps) => {
  return (
    <StyledEarningsCard accent={accent}>
      <TrapezoidHeader accent={accent}>{title}</TrapezoidHeader>
      <div>{children}</div>
    </StyledEarningsCard>
  );
};

const SoloMiningEarningsCard = ({
  coin,
  address,
  interval,
}: {
  coin: string;
  address: string;
  interval: EstimateInterval;
}) => {
  const { data: minerStatsState } = useMinerStatsQuery({ coin, address });
  const { t } = useTranslation('dashboard');

  const estimated = useGetEstimatedEarnings({
    coin,
    hashrate: minerStatsState?.averageEffectiveHashrate || 0,
    interval,
  });

  return (
    <EarningsCard
      accent={'var(--border-color)'}
      title={t('zil_promotion_popup.regular_mining')}
    >
      <Image
        alt={`etc icon`}
        width={42}
        height={42}
        src={getCoinIconUrl('etc', 'small')}
      />

      <Spacer size="md" />

      <EarningsTitle>
        {t('zil_promotion_popup.estimated_earnings')}
      </EarningsTitle>
      <EarningsFiat>{estimated.counterTicker}</EarningsFiat>
      <EarningsCoin>{estimated.ticker}</EarningsCoin>
    </EarningsCard>
  );
};

const BoostTag = styled.div`
  background-color: #15cd7221;
  color: var(--success);
  padding: 8px;
  border-radius: 5px;
  display: inline-block;
  font-size: 10px;
  margin-top: 20px;

  @media screen and (min-width: 768px) {
    font-size: 16px;
    padding: 8px 16px;
    margin-top: 26px;
  }
`;

const DualMiningEarningsCard = ({
  address,
  interval,
}: {
  address: string;
  interval: EstimateInterval;
}) => {
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const percentFormatter = useLocalizedPercentFormatter();
  const { t } = useTranslation('dashboard');

  const { data: minerStatsState } = useMinerStatsQuery({
    coin: 'etc',
    address,
  });

  const etcEstimated = useGetEstimatedEarnings({
    coin: 'etc',
    hashrate: minerStatsState?.averageEffectiveHashrate || 0,
    interval,
  });

  const zilEstimated = useGetEstimatedEarnings({
    coin: 'zil',
    hashrate: minerStatsState?.averageEffectiveHashrate || 0,
    interval,
  });

  return (
    <EarningsCard
      title={t('zil_promotion_popup.dual_mining')}
      accent={'var(--success)'}
    >
      <InlineStack>
        <div
          style={{
            transform: 'translateX(10px)',
          }}
        >
          <Image
            alt={`etc icon`}
            width={42}
            height={42}
            src={getCoinIconUrl('etc', 'small')}
          />
        </div>

        <div
          style={{
            transform: 'translateX(-10px)',
          }}
        >
          <Image
            alt={`zil icon`}
            width={42}
            height={42}
            src={getCoinIconUrl('zil', 'small')}
          />
        </div>
      </InlineStack>
      <Spacer size="md" />
      <EarningsTitle>
        {t('zil_promotion_popup.estimated_earnings')}
      </EarningsTitle>
      <EarningsFiat>
        {etcEstimated.counterTickerValue &&
          zilEstimated.counterTickerValue &&
          currencyFormatter(
            etcEstimated.counterTickerValue + zilEstimated.counterTickerValue
          )}
      </EarningsFiat>

      {zilEstimated.ticker && etcEstimated.ticker ? (
        <EarningsCoin>
          {etcEstimated.ticker} + {zilEstimated.ticker}
        </EarningsCoin>
      ) : (
        '-'
      )}

      {zilEstimated.counterTickerValue && etcEstimated.counterTickerValue && (
        <BoostTag>
          <Stack spacing="xs">
            <FiArrowUp />
            <div>
              {`${percentFormatter(
                zilEstimated.counterTickerValue /
                  etcEstimated.counterTickerValue
              )} ${t('zil_promotion_popup.extra_earnings')}`}
            </div>
          </Stack>
        </BoostTag>
      )}
    </EarningsCard>
  );
};

type EstimateInterval = 1 | 7 | 30;

const useGetEstimatedEarnings = ({
  coin,
  hashrate,
  interval,
}: {
  coin: string;
  hashrate: number;
  interval: EstimateInterval;
}) => {
  const { data: dailyRewardsPerGh } = usePoolDailyRewardPerGigahashSecQuery({
    coin,
  });

  const { data: poolCoinsFull } = usePoolCoinsFullQuery();

  const targetCoin = poolCoinsFull?.find((c) => c.ticker === (coin as any));

  const counterTicker = useCounterTicker();
  const coinPrice = targetCoin?.marketData.prices[counterTicker] || 0;

  const activeCoinFormatter = useLocalizedCoinValueFormatter({
    coin,
    defaultOptions: {
      maximumFractionDigits: 2,
    },
  });
  const currencyFormatter = useLocalizedCurrencyFormatter();

  const estimatedDailyEarnings = React.useMemo(() => {
    const rewards = dailyRewardsPerGh;

    if (rewards === undefined || hashrate === undefined) {
      return null;
    }

    return rewards * (hashrate / 1000000000);
  }, [dailyRewardsPerGh, hashrate]);

  const estimated = React.useMemo(() => {
    return {
      ticker:
        estimatedDailyEarnings !== null
          ? activeCoinFormatter(estimatedDailyEarnings * interval)
          : null,
      counterTicker:
        estimatedDailyEarnings !== null && coinPrice
          ? currencyFormatter(
              ((estimatedDailyEarnings * interval) /
                Math.pow(10, targetCoin?.decimalPlaces || 9)) *
                coinPrice
            )
          : null,
      counterTickerValue:
        estimatedDailyEarnings !== null && coinPrice
          ? ((estimatedDailyEarnings * interval) /
              Math.pow(10, targetCoin?.decimalPlaces || 9)) *
            coinPrice
          : null,
    };
  }, [
    activeCoinFormatter,
    currencyFormatter,
    targetCoin,
    interval,
    estimatedDailyEarnings,
    coinPrice,
  ]);

  return estimated;
};

const StyledButton = styled.a`
  color: white;
  padding: 12px 10px 12px 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  white-space: pre;

  background-color: var(--primary);
  border-radius: 4px;

  transition: all 0.1s linear;

  svg {
    position: relative;
    left: 0;
    transition: left 0.1s linear;
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

export const ViewGuideButton = ({
  href,
  children,
  color = 'var(--primary)',
}: {
  color?: string;
  href: string;
  children;
}) => {
  return (
    <Link href={href} passHref>
      <StyledButton
        style={{
          backgroundColor: color,
        }}
      >
        {children}
        <FiChevronRight />
      </StyledButton>
    </Link>
  );
};

const MobileFooter = styled.div`
  height: 80px;
  display: block;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const EarningsCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;

  @media screen and (min-width: 768px) {
    width: auto;
    gap: 20px;
  }
`;

const PromotionBarContent = styled(Stack)``;

export const ZILPromotionBar = ({
  className,
  coin,
  address,
}: {
  className?: string;
  coin: string;
  address: string;
}) => {
  const [open, setOpen] = useState(false);
  const { data } = usePoolCoinsFullQuery();
  const percentFormatter = useLocalizedPercentFormatter();

  const { t } = useTranslation('dashboard');

  const primaryCoin = data?.find((coin) => coin.ticker === 'etc');
  const dualCoin = data?.find((coin) => coin.ticker === 'zil');

  const primaryEarnings = getDailyCoinEarningsPer100(primaryCoin, 'usd');
  const dualEarnings = getDailyCoinEarningsPer100(dualCoin, 'usd');

  const boostPercent = data
    ? percentFormatter(dualEarnings / primaryEarnings)
    : '-';

  const [interval, setInterval] = useState<EstimateInterval>(1);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal isOpen={open} handleClose={handleClose} mobileFull>
        <Modal.Header>
          <div
            style={{
              width: '90%',
            }}
          >
            <h2>{t('zil_promotion_popup.learn_more_about')}</h2>
          </div>
        </Modal.Header>
        <ScrollArea>
          <Modal.Body>
            <ComparisonSection>
              <Heading>{t('zil_promotion_popup.earnings_comparison')}</Heading>

              <EarningsCardContainer>
                <SoloMiningEarningsCard
                  coin={coin}
                  address={address}
                  interval={interval}
                />
                <DualMiningEarningsCard address={address} interval={interval} />
              </EarningsCardContainer>
              <Spacer size="md" />
              <DurationPicker
                options={[
                  { label: t('zil_promotion_popup.daily'), value: 1 },
                  { label: t('zil_promotion_popup.weekly'), value: 7 },
                  { label: t('zil_promotion_popup.monthly'), value: 30 },
                ]}
                selected={interval}
                onChange={setInterval}
              />
            </ComparisonSection>

            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '24px 34px',
                borderRadius: '5px',
                marginTop: '32px',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '26px',
                  marginBottom: '8px',
                }}
              >
                {t('zil_promotion_popup.get_the_most')}
              </div>
              <Description>
                {t('zil_promotion_popup.read_our_guide')}
              </Description>

              <Spacer />

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <ViewGuideButton
                  href="/get-started/zil/dual"
                  color="var(--primary)"
                >
                  {t('zil_promotion_popup.view_gpu')}
                </ViewGuideButton>

                <ViewGuideButton
                  href="/get-started/zil/dual-asic"
                  color="var(--primary)"
                >
                  {t('zil_promotion_popup.view_asic')}
                </ViewGuideButton>
              </div>
            </div>
            <MobileFooter />
          </Modal.Body>
        </ScrollArea>
      </Modal>
      <Card
        className={className}
        style={{
          position: 'absolute',
          width: '100%',
          paddingTop: '26px',
          transform: 'translateY(-28px)',
          background:
            'linear-gradient(90.41deg, rgba(0, 105, 255, 0.2) 0.21%, rgba(21, 205, 114, 0.2) 97.64%)',
        }}
      >
        <div
          style={{
            padding: '8px',
          }}
        >
          <PromotionBarContent>
            <IconStack>
              <CoinIcon coin={'etc'} />
              <CoinIcon coin={'zil'} />
            </IconStack>
            <Text>
              <Trans
                t={t}
                i18nKey="zil_promotion_popup.earn_more"
                components={{
                  hl: <Highlight />,
                }}
                values={{
                  percent: boostPercent,
                }}
              />
            </Text>
            <CTA
              style={{
                marginLeft: 'auto',
              }}
              onClick={() => {
                setOpen(true);
              }}
            >
              {t('zil_promotion_popup.learn_more')}
            </CTA>
          </PromotionBarContent>
        </div>
      </Card>
    </>
  );
};

export default ZILPromotionBar;
