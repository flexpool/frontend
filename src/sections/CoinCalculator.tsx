import { Formik } from 'formik';
import React from 'react';
import { Button } from 'src/components/Button';
import { SelectField } from 'src/components/Form/Select/Select';
import { TextField } from 'src/components/Form/TextInput';
import { Card, CardBody } from 'src/components/layout/Card';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';

const FieldContainer = styled.div`
  display: flex;
  margin-top: 0.75rem;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  & > * {
    margin: 0.25rem;
  }

  @media screen and (max-width: 1280px) {
    flex-wrap: wrap;
    & > *:first-child {
      width: 100%;
    }
    & > *:not(:first-child) {
      flex-grow: 1;
    }
  }
`;

const Revenue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const RCounter = styled.span`
  color: var(--text-secondary);
`;

const StartMiningButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
  justify-content: center;
`;

type Period = 'd' | 'm' | 'y';

type PeriodObject<T> = { [k in Period]: T };

const periodsAvailable: Period[] = ['d', 'm', 'y'];
const periodMap: PeriodObject<number> = { d: 1, m: 30.5, y: 365.25 };

export const CoinCalculator: React.FC<{ coin: ApiPoolCoinFull }> = ({
  coin,
}) => {
  const { t } = useTranslation('home');
  const siMap = { '': 1, k: 1000, M: 1000000, G: 1000000000, T: 1000000000000 };
  const counterTicker = useCounterTicker();
  const counterPrice = coin.marketData.prices[counterTicker];
  const numberFormatter = useLocalizedNumberFormatter();
  const currencyFormatter = useLocalizedCurrencyFormatter();

  const periodNameMap: PeriodObject<string> = {
    d: t('coin_news_item.calculator.per_day'),
    m: t('coin_news_item.calculator.per_month'),
    y: t('coin_news_item.calculator.per_year'),
  };

  const incomePerHash =
    coin.chainData.dailyRewardPerGigaHashSec /
    1000000000 /
    Math.pow(10, coin.decimalPlaces);

  const initValues: {
    si: keyof typeof siMap;
    period: Period;
    val: string;
  } = {
    si: 'M',
    period: 'm',
    val: '100',
  };

  return (
    <div>
      <Formik initialValues={initValues} onSubmit={() => {}}>
        {({ values }) => {
          const revenueEth = `${numberFormatter(
            Number(values.val) *
              siMap[values.si] *
              incomePerHash *
              periodMap[values.period],
            { maximumFractionDigits: 5 }
          )} ${coin.ticker.toUpperCase()}`;

          const revenueCounter = currencyFormatter(
            Number(values.val) *
              siMap[values.si] *
              incomePerHash *
              periodMap[values.period] *
              counterPrice
          );

          return (
            <Card>
              <CardBody>
                <h2>
                  {t('coin_news_item.calculator.title')}
                  {'  '}
                  <Tooltip>
                    <TooltipContent>
                      {t('coin_news_item.calculator.description')}
                    </TooltipContent>
                  </Tooltip>
                </h2>
                <FieldContainer>
                  <TextField name="val" type="number" inputMode="numeric" />
                  <SelectField
                    name="si"
                    options={coin.applicableHashrateSiPrefixes.map((si) => {
                      return { value: si, label: `${si}H/s` };
                    })}
                  />
                  <SelectField
                    name="period"
                    options={periodsAvailable.map((period) => {
                      return { value: period, label: periodNameMap[period] };
                    })}
                  />
                </FieldContainer>
              </CardBody>
              <CardBody>
                <Revenue>
                  ≈ {revenueEth}
                  <RCounter> ({revenueCounter}) </RCounter>
                  {periodNameMap[values.period]}
                </Revenue>
              </CardBody>
            </Card>
          );
        }}
      </Formik>
      <StartMiningButton
        as={Link}
        to={`/get-started/${coin.ticker}`}
        variant="primary"
      >
        {t('coin_news_item.calculator.cta')}
      </StartMiningButton>
    </div>
  );
};
