import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { TextField } from '@/components/Form/TextInput';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { get } from 'lodash';

export const UnitContainer = styled.div`
  padding: 0 1rem;
`;

type ThresholdInputProps = {
  name: string;
  isBTC: boolean;
  isMainnet: boolean;
};

const ThresholdInput = ({ name, isBTC, isMainnet }: ThresholdInputProps) => {
  const { t } = useTranslation(['common']);
  const activeCoin = useActiveCoin();
  const activeCoinTicker = useActiveCoinTicker();
  const { values } = useFormikContext();

  const minPayoutLimit = useMemo(() => {
    if (!activeCoin) return 0;

    const lowestThreshold = isBTC
      ? activeCoin.lowestBtcMinPayoutThreshold
      : activeCoin.lowestMinPayoutThreshold;

    const mainnetLimit =
      lowestThreshold / Math.pow(10, activeCoin.decimalPlaces);

    if (!isMainnet) return mainnetLimit / 2;
    return mainnetLimit;
  }, [activeCoin, isMainnet]);

  if (!activeCoin) return null;

  return (
    <TextField
      name="payoutLimit"
      label={t('dashboard:settings.payout.limit', {
        min: minPayoutLimit,
      })}
      embelishment={
        activeCoinTicker.toUpperCase() ? (
          <UnitContainer>{activeCoinTicker.toUpperCase()}</UnitContainer>
        ) : undefined
      }
      inputMode="decimal"
      desc={t('dashboard:settings.payout.limit_desc', {
        value: `${get(values, name)} ${activeCoin.ticker.toUpperCase()}`,
      })}
    />
  );
};

export default ThresholdInput;
