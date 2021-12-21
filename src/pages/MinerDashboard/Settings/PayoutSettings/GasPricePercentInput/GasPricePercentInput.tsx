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
  address: string;
  onToggle: () => void;
};

const GasPricePercentInput = ({
  onToggle,
  address,
}: GasPricePercentInputProps) => {
  const { values } = useFormikContext();
  const { t } = useTranslation(['common']);
  const activeCoinTicker = useActiveCoinTicker();
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);

  if (!feeDetails) return null;

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
            <Description address={address} />
          ) : (
            t('dashboard:settings.payout.gas_limit_zero')
          )}
        </p>
      }
    />
  );
};

export default GasPricePercentInput;
