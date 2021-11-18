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

type GasPricePercentInputProps = {
  name: string;
  onToggle: () => void;
};

const GasPricePercentInput = ({
  name,
  onToggle,
}: GasPricePercentInputProps) => {
  const { values } = useFormikContext();
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const { t } = useTranslation(['common']);
  const activeCoin = useActiveCoin();
  const activeCoinTicker = useActiveCoinTicker();
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const minerSettings = useReduxState('minerDetails');

  if (!activeCoin || !feeDetails || !minerHeaderStats || !minerSettings)
    return null;

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
        <>
          <p>
            {Number(get(values, 'maxFeePricePercent')) > 0 ? (
              <>
                {t('dashboard:settings.payout.gas_limit_desc', {
                  value: Math.round(
                    ((Number(get(values, 'maxFeePricePercent')) / 100) *
                      Math.pow(10, activeCoin.decimalPlaces) *
                      Number(
                        minerSettings &&
                          minerSettings.data &&
                          minerSettings.data.payoutLimit /
                            Math.pow(10, activeCoin.decimalPlaces)
                      )) /
                      activeCoin.transactionSize /
                      feeDetails.multiplier
                  ),
                  valueUnit: feeDetails?.unit,
                  valueTicker: currencyFormatter(
                    ((Math.round(
                      ((Number(get(values, 'maxFeePricePercent')) / 100) *
                        Math.pow(10, activeCoin.decimalPlaces) *
                        Number(
                          minerSettings &&
                            minerSettings.data &&
                            minerSettings.data.payoutLimit /
                              Math.pow(10, activeCoin.decimalPlaces)
                        )) /
                        activeCoin.transactionSize /
                        feeDetails.multiplier
                    ) *
                      activeCoin.transactionSize *
                      feeDetails.multiplier) /
                      Math.pow(10, activeCoin.decimalPlaces)) *
                      minerHeaderStats.data!.countervaluePrice
                  ),
                }).substring(
                  0,
                  Number(
                    t('dashboard:settings.payout.gas_limit_desc', {
                      value: Number(get(values, 'maxFeePrice')),
                      valueUnit: feeDetails?.unit,
                      valueTicker: currencyFormatter(
                        ((Number(get(values, 'maxFeePrice')) *
                          activeCoin.transactionSize *
                          feeDetails.multiplier) /
                          Math.pow(10, activeCoin.decimalPlaces)) *
                          minerHeaderStats.data!.countervaluePrice
                      ),
                    }).indexOf('{delimiter}')
                  )
                )}

                <PercentageDisplaySpan
                  color={
                    Number(get(values, 'maxFeePricePercent')) >= 10
                      ? 'red'
                      : Number(get(values, 'maxFeePricePercent')) >= 5
                      ? 'yellow'
                      : ''
                  }
                >
                  {get(values, 'maxFeePricePercent')}%
                </PercentageDisplaySpan>
                {t('dashboard:settings.payout.gas_limit_desc', {
                  value: Math.round(
                    ((Number(get(values, 'maxFeePricePercent')) / 100) *
                      Math.pow(10, activeCoin.decimalPlaces) *
                      Number(
                        minerSettings &&
                          minerSettings.data &&
                          minerSettings.data.payoutLimit /
                            Math.pow(10, activeCoin.decimalPlaces)
                      )) /
                      activeCoin.transactionSize /
                      feeDetails.multiplier
                  ),
                  valueUnit: feeDetails?.unit,
                  valueTicker: currencyFormatter(
                    ((Math.round(
                      ((Number(get(values, 'maxFeePricePercent')) / 100) *
                        Math.pow(10, activeCoin.decimalPlaces) *
                        Number(
                          minerSettings &&
                            minerSettings.data &&
                            minerSettings.data.payoutLimit /
                              Math.pow(10, activeCoin.decimalPlaces)
                        )) /
                        activeCoin.transactionSize /
                        feeDetails.multiplier
                    ) *
                      activeCoin.transactionSize *
                      feeDetails.multiplier) /
                      Math.pow(10, activeCoin.decimalPlaces)) *
                      minerHeaderStats.data!.countervaluePrice
                  ),
                }).substring(
                  Number(
                    t('dashboard:settings.payout.gas_limit_desc', {
                      value: Number(get(values, 'maxFeePrice')),
                      valueUnit: feeDetails?.unit,
                      valueTicker: currencyFormatter(
                        ((Number(get(values, 'maxFeePrice')) *
                          activeCoin.transactionSize *
                          feeDetails.multiplier) /
                          Math.pow(10, activeCoin.decimalPlaces)) *
                          minerHeaderStats.data!.countervaluePrice
                      ),
                    }).indexOf('{delimiter}') + 11
                  )
                )}
              </>
            ) : (
              t('dashboard:settings.payout.gas_limit_zero')
            )}
          </p>
        </>
      }
    />
  );
};

export default GasPricePercentInput;
