import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { TextField } from '@/components/Form/TextInput';
import { useReduxState } from '@/rdx/useReduxState';
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

type GasPricePercentInputProps = {
  onToggle: () => void;
};

const GasPricePercentInput = ({ onToggle }: GasPricePercentInputProps) => {
  const { values } = useFormikContext();
  const { t } = useTranslation(['common']);
  const activeCoinTicker = useActiveCoinTicker();
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const minerSettings = useReduxState('minerDetails');

  if (!feeDetails || !minerHeaderStats || !minerSettings) return null;

  return (
    <TextField
      name="maxFeePricePercent"
      label={t('dashboard:settings.payout.gas_limit')}
      embelishment={
        feeDetails?.unit.toUpperCase() ? (
          <GweiToggle type="button" onClick={onToggle}>
            <InactiveToggleText>
              {feeDetails?.unit.toUpperCase()}&nbsp;/&nbsp;
            </InactiveToggleText>
            <ActiveToggleText>%</ActiveToggleText>
          </GweiToggle>
        ) : undefined
      }
      inputMode="decimal"
      desc={
        <p>
          {Number(get(values, 'maxFeePricePercent')) > 0 ? (
            <Description />
          ) : (
            t('dashboard:settings.payout.gas_limit_zero')
          )}
        </p>
      }
    />
  );
};

export default GasPricePercentInput;
