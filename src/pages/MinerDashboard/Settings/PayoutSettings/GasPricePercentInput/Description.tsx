import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useReduxState } from '@/rdx/useReduxState';
import useMinerDetailsQuery from '@/hooks/api/useMinerDetailsQuery';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useFeePayoutLimitDetails } from '@/hooks/useFeePayoutDetails';
import { get } from 'lodash';
import { useLocalizedCurrencyFormatter } from 'src/utils/si.utils';

export const PercentageDisplaySpan = styled.span<{ color?: string }>`
  ${(p) =>
    p.color === 'yellow' &&
    `
          color: var(--warning);
          `}
  ${(p) =>
    p.color === 'red' &&
    `
      color: var(--danger);
      `}
`;

const Description = ({ address }: { address: string }) => {
  const { t } = useTranslation(['common']);
  const { values } = useFormikContext();
  const activeCoin = useActiveCoin();
  const activeCoinTicker = useActiveCoinTicker();
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const { data: minerDetails } = useMinerDetailsQuery({ coin: 'eth', address });

  const maxFeePricePercent = useMemo(
    () => Number(get(values, 'maxFeePricePercent')),
    [values]
  );

  if (!activeCoin || !feeDetails || !minerDetails) return null;

  const description = t('dashboard:settings.payout.gas_limit_desc', {
    value: Math.round(
      ((maxFeePricePercent / 100) *
        Math.pow(10, activeCoin.decimalPlaces) *
        Number(
          minerDetails.payoutLimit / Math.pow(10, activeCoin.decimalPlaces)
        )) /
        activeCoin.transactionSize /
        feeDetails.multiplier
    ),
    valueUnit: feeDetails?.unit,
    valueTicker: currencyFormatter(
      ((Math.round(
        ((maxFeePricePercent / 100) *
          Math.pow(10, activeCoin.decimalPlaces) *
          Number(
            minerDetails.payoutLimit / Math.pow(10, activeCoin.decimalPlaces)
          )) /
          activeCoin.transactionSize /
          feeDetails.multiplier
      ) *
        activeCoin.transactionSize *
        feeDetails.multiplier) /
        Math.pow(10, activeCoin.decimalPlaces)) *
        minerHeaderStats.data!.countervaluePrice
    ),
  });

  let percentColor = '';
  if (maxFeePricePercent >= 5) percentColor = 'yellow';
  if (maxFeePricePercent >= 10) percentColor = 'red';

  return (
    <>
      {/* // We use this hack because i18next does not support component interpolation,
    // so we need to manually assemble the string */}
      {description.split('{delimiter}')[0]}
      <PercentageDisplaySpan color={percentColor}>
        {maxFeePricePercent}%
      </PercentageDisplaySpan>
      {description.split('{delimiter}')[1]}
    </>
  );
};

export default Description;
