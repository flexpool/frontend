import {
  UnknownCoin,
  CoinIcon,
  EarningBox,
  Container,
  HeadContent,
  HeadSplit,
  IntervalContainer,
  IntervalItem,
  StartMiningContainer,
  Desc,
  PoolDetails,
} from './components';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Spacer } from 'src/components/layout/Spacer';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components';
import usePoolCoinsFullQuery from '@/hooks/api/usePoolCoinsFullQuery';
import Badge from '@/components/Badge';
export const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY;

import { PoolFee } from './PoolFee';
import { EarningEstimationStats } from './EarningEstimationStats';

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

const CoinEarningsItem: React.FC<{
  data?: ApiPoolCoinFull;
}> = ({ data }) => {
  const { t } = useTranslation('home');

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
      <IntervalContainer>
        <IntervalItem>
          <EarningEstimationStats
            config={{
              coinData: data,
              duration: 'daily',
              n: 100,
            }}
          />
        </IntervalItem>
        <IntervalItem>
          <EarningEstimationStats
            config={{
              coinData: data,
              duration: 'monthly',
              n: 100,
            }}
          />
        </IntervalItem>
      </IntervalContainer>
      {data?.ticker && (
        <StartMiningContainer>
          <PoolDetails>
            <PoolFee coin={data.ticker} />
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
            .filter((c) => !c.isDual)
            .filter((c) => !c.payoutsOnly)
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
