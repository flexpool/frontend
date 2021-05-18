import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaDiscord, FaReddit, FaTelegram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
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
import * as yup from 'yup';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
  useLocalizedPercentFormatter,
} from 'src/utils/si.utils';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components/macro';

import chiaImage from './assets/chia_text.png';

const UnknownCoin = styled.div`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  svg {
    height: 45%;
    width: 45%;
  }
  img {
    max-height: 80%;
    max-width: 80%;
  }
`;

const CoinIcon = styled(Img)`
  width: 60px;
  height: 60px;
`;

const EarningBox = styled.div`
  color: white;
  p,
  h2,
  span {
    color: var(--text-on-bg);
  }
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
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
  margin-top: 1rem;
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
        <PoolDetails>
          <p>
            {t('coin_earnings_cards.pool_fee', {
              value: percentFormatter(5 / 1000),
            })}
            <br />
            {data?.ticker === 'eth' &&
              t('coin_earnings_cards.mev', { value: percentFormatter(0.9) })}
          </p>
        </PoolDetails>
      </HeadSplit>
      <IntervalContainer>
        <IntervalItem>
          <p>100 MH/s {t('coin_earnings_cards.daily')}</p>
          <FiatValue>
            {dailyCounterPrice ? (
              currencyFormatter(dailyCounterPrice)
            ) : (
              <Skeleton style={{ height: 25 }} />
            )}
          </FiatValue>
          <p>
            {dailyPer100 ? (
              <>
                {numberFormatter(dailyPer100, { maximumFractionDigits: 6 })}{' '}
                {data?.ticker.toUpperCase()}
              </>
            ) : (
              <Skeleton style={{ height: 10 }} />
            )}
          </p>
        </IntervalItem>
        <IntervalItem>
          <p>100 MH/s {t('coin_earnings_cards.monthly')}</p>
          <FiatValue>
            {monthlyCounterPrice ? (
              currencyFormatter(monthlyCounterPrice)
            ) : (
              <Skeleton style={{ height: 25 }} />
            )}
          </FiatValue>
          <Desc>
            {monthlyPer100 ? (
              <>
                {numberFormatter(monthlyPer100, { maximumFractionDigits: 6 })}{' '}
                {data?.ticker.toUpperCase()}
              </>
            ) : (
              <Skeleton style={{ height: 10 }} />
            )}
          </Desc>
        </IntervalItem>
      </IntervalContainer>
      {data?.ticker && (
        <StartMiningContainer>
          <Button
            variant="success"
            as={Link}
            to={`/get-started/${data?.ticker}`}
          >
            {t('coin_earnings_cards.cta_mine')}
          </Button>
        </StartMiningContainer>
      )}
    </EarningBox>
  );
};

// const ComingSoonCoin = () => {
//   const { t } = useTranslation('home');
//   return (
//     <EarningBox>
//       <HeadSplit>
//         {/* <CoinIcon src={getCoinIconSrc('zec')} /> */}
//         <UnknownCoin>
//           <FaRocket />
//         </UnknownCoin>
//         <HeadContent>
//           <h2>{t('coin_earnings_cards.more_title')}</h2>
//           <p>{t('coin_earnings_cards.more_description')}</p>
//         </HeadContent>
//       </HeadSplit>
//       <IntervalContainer>
//         <StartMiningContainer>
//           <ButtonGroup>
//             <Button variant="danger" as={LinkOut} href={REDDIT_LINK}>
//               <FaReddit /> &nbsp; Reddit
//             </Button>{' '}
//             <Button variant="primary" as={LinkOut} href={TELEGRAM_LINK}>
//               <FaTelegram /> &nbsp; Telegram
//             </Button>{' '}
//             <Button variant="warning" as={LinkOut} href={DISCORD_LINK}>
//               <FaDiscord />
//               &nbsp;Discord
//             </Button>
//           </ButtonGroup>
//         </StartMiningContainer>
//       </IntervalContainer>
//     </EarningBox>
//   );
// };

const FormContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  & > *:first-child {
    margin-right: 1rem;
    flex-grow: 1;
  }
`;

const ChiaBox = styled(EarningBox)`
  background: #36ad58; // original chia, doesn't look good on blue
  background: var(--success);
`;

const ChiaCoin = styled(UnknownCoin)`
  height: 60px;
  width: 60px;
  background: var(--bg-secondary);
`;

const SocialButtonChia = styled(Button)`
  color: var(--text-on-bg);
`;

const ComingSoonChia = () => {
  const { t } = useTranslation(['home', 'common']);
  return (
    <ChiaBox>
      <HeadSplit>
        {/* <CoinIcon src={getCoinIconSrc('zec')} /> */}
        <ChiaCoin>
          <Img alt="xch chia coin" src={chiaImage} />
        </ChiaCoin>
        <HeadContent>
          <h2>Chia Coming Soon!</h2>
          <p>
            We are about to launch a Chia pool once Chia adds pool capability.
            Please signup here for updates or join us at the below
          </p>
          <Formik
            initialValues={{ email: '' }}
            onSubmit={({ email }, { setSubmitting }) => {
              console.log(email);
              setSubmitting(false);
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .email(t('common:errors.email_invalid'))
                .required(t('common:errors.email_required')),
            })}
          >
            <Form>
              <FormContainer>
                <TextField name="email" placeholder="your@email.fpl" />
                <Submit variant={undefined}>Subscribe!</Submit>
              </FormContainer>
            </Form>
          </Formik>
        </HeadContent>
      </HeadSplit>
      <IntervalContainer>
        <StartMiningContainer>
          <ButtonGroup>
            <SocialButtonChia fill="outline" as={LinkOut} href={REDDIT_LINK}>
              <FaReddit /> &nbsp; Reddit
            </SocialButtonChia>{' '}
            <SocialButtonChia fill="outline" as={LinkOut} href={TELEGRAM_LINK}>
              <FaTelegram /> &nbsp; Telegram
            </SocialButtonChia>{' '}
            <SocialButtonChia fill="outline" as={LinkOut} href={DISCORD_LINK}>
              <FaDiscord />
              &nbsp;Discord
            </SocialButtonChia>
          </ButtonGroup>
        </StartMiningContainer>
      </IntervalContainer>
    </ChiaBox>
  );
};

export const CoinEarnings = () => {
  const coinsFull = useReduxState('poolCoinsFull');

  const data = coinsFull.data || [];
  const { t } = useTranslation('home');

  return (
    <Content>
      <Spacer size="xl" />
      <Container>
        {data.length > 0 ? (
          data.map((item) => <CoinEarningsItem key={item.ticker} data={item} />)
        ) : (
          <CoinEarningsItem />
        )}
        <ComingSoonChia />
      </Container>
    </Content>
  );
};
