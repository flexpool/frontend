import { useMemo, useCallback } from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { TextField } from '@/components/Form/TextInput';
import { useReduxState } from '@/rdx/useReduxState';
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

export const GweiToggle = styled.button`
  height: 48px;
  width: 100%;
  padding: 0 1rem;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActiveToggleText = styled.span`
  color: var(--text-primary);
`;

export const InactiveToggleText = styled.span`
  color: var(--text-tertiary);
`;

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

type GasPriceInputProps = {
  name: string;
  onToggle: () => void;
};

const GasPriceInput = ({ name, onToggle }: GasPriceInputProps) => {
  const { values } = useFormikContext();
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const numberFormatter = useLocalizedNumberFormatter();
  const { t } = useTranslation(['common']);
  const activeCoin = useActiveCoin();
  const activeCoinTicker = useActiveCoinTicker();
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const minerSettings = useReduxState('minerDetails');
  const inputValue = useMemo(() => Number(get(values, name)), [values, name]);
  const payoutLimit = useMemo(
    () => Number(get(values, 'payoutLimit')),
    [values]
  );

  const gasLimitPercentage = useMemo(() => {
    if (!activeCoin || !feeDetails) return 0;

    return (
      (inputValue * activeCoin.transactionSize * feeDetails.multiplier) /
      Math.pow(10, activeCoin.decimalPlaces) /
      payoutLimit
    );
  }, [inputValue, activeCoin, feeDetails, payoutLimit]);

  const renderGasLimitDescription = useCallback(() => {
    if (!activeCoin || !feeDetails) return '';

    const description = t('dashboard:settings.payout.gas_limit_desc', {
      value: inputValue,
      valueUnit: feeDetails?.unit,
      valueTicker: currencyFormatter(
        ((inputValue * activeCoin.transactionSize * feeDetails.multiplier) /
          Math.pow(10, activeCoin.decimalPlaces)) *
          minerHeaderStats.data!.countervaluePrice
      ),
    }).split('{delimiter}');
    // We use this hack because i18next does not support component interpolation,
    // so we need to manually assemble the string

    let percentColor = '';
    if (gasLimitPercentage >= 0.1) percentColor = 'red';
    if (gasLimitPercentage >= 0.05) percentColor = 'yellow';

    return (
      <>
        {description[0]}
        <PercentageDisplaySpan color={percentColor}>
          {numberFormatter(gasLimitPercentage, {
            style: 'percent',
            maximumFractionDigits: 3,
          })}
        </PercentageDisplaySpan>
        {description[1]}
      </>
    );
  }, [
    t,
    activeCoin,
    feeDetails,
    inputValue,
    minerHeaderStats,
    currencyFormatter,
    gasLimitPercentage,
    numberFormatter,
  ]);

  if (!activeCoin || !feeDetails || !minerHeaderStats || !minerSettings)
    return null;

  return (
    <TextField
      name={name}
      label={t('dashboard:settings.payout.gas_limit')}
      embelishment={
        feeDetails?.unit.toUpperCase() && (
          <GweiToggle type="button" onClick={onToggle}>
            <ActiveToggleText>
              {feeDetails?.unit.toUpperCase()}
            </ActiveToggleText>
            <InactiveToggleText>&nbsp;/&nbsp;%</InactiveToggleText>
          </GweiToggle>
        )
      }
      inputMode="decimal"
      desc={
        <p>
          {inputValue > 0
            ? renderGasLimitDescription()
            : t('dashboard:settings.payout.gas_limit_zero')}
        </p>
      }
    />
  );
};

export default GasPriceInput;
