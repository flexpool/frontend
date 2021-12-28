import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useFeePayoutLimitDetails } from '@/hooks/useFeePayoutDetails';
import { get } from 'lodash';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import useMinerBalance from '@/hooks/useMinerBalance';

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
  const numberFormatter = useLocalizedNumberFormatter();
  const { data: minerBalance } = useMinerBalance(address, 'eth');

  const maxFeePrice = useMemo(
    () => Number(get(values, 'maxFeePrice')),
    [values]
  );
  const payoutLimit = useMemo(
    () => Number(get(values, 'payoutLimit')),
    [values]
  );

  const gasLimitPercentage = useMemo(() => {
    if (!activeCoin || !feeDetails) return 0;

    return (
      (maxFeePrice * activeCoin.transactionSize) /
      feeDetails.multiplier / // total transaction fee in ETH
      payoutLimit
    );
  }, [activeCoin, feeDetails, payoutLimit, maxFeePrice]);

  if (!activeCoin || !feeDetails) return null;

  const description = t('dashboard:settings.payout.gas_limit_desc', {
    value: maxFeePrice,
    valueUnit: feeDetails?.unit,
    valueTicker: minerBalance
      ? currencyFormatter(
          ((maxFeePrice * activeCoin.transactionSize * feeDetails.multiplier) /
            Math.pow(10, activeCoin.decimalPlaces)) *
            minerBalance.price
        )
      : '-',
  });

  let percentColor = '';
  if (gasLimitPercentage >= 0.05) percentColor = 'yellow';
  if (gasLimitPercentage >= 0.1) percentColor = 'red';

  return (
    <>
      {/* // We use this hack because i18next does not support component interpolation,
    // so we need to manually assemble the string */}
      {description.split('{delimiter}')[0]}
      <PercentageDisplaySpan color={percentColor}>
        {numberFormatter(gasLimitPercentage, {
          style: 'percent',
          maximumFractionDigits: 6,
        })}
      </PercentageDisplaySpan>
      {description.split('{delimiter}')[1]}
    </>
  );
};

export default Description;
