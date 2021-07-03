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
  PoolDetails,
  ButtonGroup,
  Desc,
} from './components';
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

import chiaImage from './assets/chia_logo.svg';
import { fetchApi } from 'src/utils/fetchApi';
import { useAsyncState } from 'src/hooks/useAsyncState';
import ReCAPTCHA from 'react-google-recaptcha';
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
        <PoolDetails>
          <p>
            {t('coin_earnings_cards.pool_fee', {
              value:
                data?.ticker === 'eth'
                  ? percentFormatter(5 / 1000)
                  : percentFormatter(10 / 1000),
            })}
            <br />
            {data?.ticker === 'eth' &&
              t('coin_earnings_cards.mev', { value: percentFormatter(0.9) })}
          </p>
        </PoolDetails>
      </HeadSplit>
      <IntervalContainer>
        <IntervalItem>
          <p>
            100 {data?.defaultHashrateSiPrefix}
            {data?.hashrateUnit} {t('coin_earnings_cards.daily')}
          </p>
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
          <p>
            100 {data?.defaultHashrateSiPrefix}
            {data?.hashrateUnit} {t('coin_earnings_cards.monthly')}
          </p>
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

const CapchaContainer = styled.div<{ showCaptcha?: false | any }>`
  position: fixed;
  margin-top: -78px;
  margin-left: 0px;
  ${(p) => `${p.showCaptcha === false && `display: none;`}
`};
`;
const ComingSoonChia: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);
  const chiaSignupState = useAsyncState<string | null>('email', null);
  const [captchaToken, setCaptchaToken] = React.useState(false);
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [submissionSuccessful, setSubmissionSuccessful] = React.useState(false);

  const submitEmail = (capchaToken: any) => {
    chiaSignupState
      .start(
        fetchApi(
          '/subscribe',
          {
            method: 'POST',
            body: { email: email, captcha: capchaToken },
          },
          'chia'
        )
      )
      .then((response) => {
        if (response) {
          setSubmissionSuccessful(true);
        } else {
          alert(t('home:chia.email_submission_failure'));
        }
      })
      .catch(() => {
        alert(t('home:chia.email_submission_failure'));
      });
  };
  return (
    <ChiaBox>
      <HeadSplit>
        <ChiaCoin>
          <Img alt="xch chia coin" src={chiaImage} />
        </ChiaCoin>
        <HeadContent>
          <h2>{t('home:chia.chia_coming_soon')}</h2>
          <p>{t('home:chia.chia_comming_soon_text')}</p>
          <Formik
            initialValues={{ email: '' }}
            onSubmit={({ email }, { setSubmitting }) => {
              if (!captchaToken) {
                setShowCaptcha(true);
                setSubmitting(false);
              }
              setEmail(email);
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
                <CapchaContainer showCaptcha={showCaptcha}>
                  <ReCAPTCHA
                    theme="dark"
                    sitekey={recaptchaKey || ''}
                    onChange={(value: any) => {
                      if (value !== false && value !== null) {
                        setCaptchaToken(value);
                        submitEmail(value);
                        setTimeout(() => {
                          setShowCaptcha(false);
                        }, 1000);
                      }
                    }}
                  />
                </CapchaContainer>
                <TextField
                  name="email"
                  placeholder="mail@example.com"
                  disabled={submissionSuccessful}
                />
                <Submit
                  variant="success"
                  captchaDisableOverride={showCaptcha}
                  disableWhenFormNotDirty={submissionSuccessful}
                >
                  {submissionSuccessful
                    ? t('home:chia.subscribed')
                    : t('home:chia.subscribe')}
                </Submit>
              </FormContainer>
            </Form>
          </Formik>
        </HeadContent>
      </HeadSplit>
      <IntervalContainer>
        <StartMiningContainer>
          <ButtonGroup>
            <Button variant="primary" as={LinkOut} href={TELEGRAM_LINK}>
              <FaTelegram /> &nbsp; Telegram
            </Button>{' '}
            <Button variant="danger" as={LinkOut} href={REDDIT_LINK}>
              <FaReddit /> &nbsp; Reddit
            </Button>{' '}
            <Button variant="warning" as={LinkOut} href={DISCORD_LINK}>
              <FaDiscord />
              &nbsp;Discord
            </Button>
          </ButtonGroup>
        </StartMiningContainer>
      </IntervalContainer>
    </ChiaBox>
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
        <ComingSoonChia />
      </Container>
    </Content>
  );
};
