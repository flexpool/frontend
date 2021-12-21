import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { TextField } from '@/components/Form/TextInput';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useFeePayoutLimitDetails } from '@/hooks/useFeePayoutDetails';
import { get } from 'lodash';
import Description from './Description';

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

type GasPriceInputProps = {
  onToggle: () => void;
};

const GasPriceInput = ({ onToggle }: GasPriceInputProps) => {
  const { values } = useFormikContext();
  const { t } = useTranslation(['common']);
  const activeCoinTicker = useActiveCoinTicker();
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const inputValue = useMemo(
    () => Number(get(values, 'maxFeePrice')),
    [values]
  );

  if (!feeDetails) return null;

  return (
    <TextField
      name="maxFeePrice"
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
          {inputValue > 0 ? (
            <Description />
          ) : (
            t('dashboard:settings.payout.gas_limit_zero')
          )}
        </p>
      }
    />
  );
};

export default GasPriceInput;
