import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ErrorBox } from 'src/components/Form/ErrorBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useFeePayoutLimitDetails } from 'src/hooks/useFeePayoutDetails';
import { minerDetailsUpdatePayoutSettings } from 'src/rdx/minerDetails/minerDetails.actions';
import { minerDetailsGet } from 'src/rdx/minerDetails/minerDetails.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import * as yup from 'yup';
import { setLocale } from 'yup';
import { useTranslation } from 'next-i18next';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import { getDecimalPlace } from '@/utils/number.utils';
import styled from 'styled-components';
import PayoutWarning from './PayoutWarning';
import ThresholdInput from './ThresholdInput';
import GasPriceInput from './GasPriceInput';
import GasPricePercentInput from './GasPricePercentInput';

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
export const LowPayoutContainer = styled.div`
  color: var(--danger);
`;

export const PayoutSettings: React.FC<{
  address: string;
}> = ({ address }) => {
  const activeCoinTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  const minerSettings = useReduxState('minerDetails');
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const { t } = useTranslation(['common']);
  const numberFormatter = useLocalizedNumberFormatter();
  const d = useDispatch();

  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const [gweiToggle, setGweiToggle] = React.useState(true);
  if (
    !minerSettings.data ||
    !activeCoin ||
    !feeDetails ||
    !minerHeaderStats.data
  ) {
    return null;
  }

  const minPayoutLimit =
    activeCoin.lowestMinPayoutThreshold /
    Math.pow(10, activeCoin.decimalPlaces);

  const toggleGwei = () => {
    setGweiToggle(!gweiToggle);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const validate = (values) => {
    return sleep(100).then(() => {
      const errors = {} as {
        payoutLimit: string;
        maxFeePrice: Number;
        maxFeePricePercent: Number;
        ip: string;
      };
      if (values.payoutLimit < 0) {
        errors.payoutLimit = t('common:errors.required', { value: 0 });
      }

      if (getDecimalPlace(values.payoutLimit) > 4) {
        errors.payoutLimit = t('common:errors.decimal_places', {
          value: 4,
        });
      }

      if (values.ip === '') {
        errors.ip = t('common:errors.required');
      }
      return errors;
    });
  };

  return (
    <Formik
      onSubmit={async (data, { setSubmitting }) => {
        Promise.all([
          d(
            minerDetailsUpdatePayoutSettings(activeCoin.ticker, address, {
              payoutLimit:
                Number(data.payoutLimit) *
                Math.pow(10, activeCoin.decimalPlaces),
              maxFeePrice: gweiToggle
                ? Number(data.maxFeePrice)
                : Math.round(
                    ((Number(data.maxFeePricePercent) / 100) *
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
              ipAddress: data.ip,
            })
          ),
        ]).then(() => {
          d(minerDetailsGet(activeCoin.ticker, address));
        });
        setSubmitting(false);
      }}
      initialValues={{
        maxFeePrice: `${minerSettings.data.maxFeePrice}`,
        maxFeePricePercent: numberFormatter(
          ((Number(minerSettings.data.maxFeePrice) *
            activeCoin.transactionSize *
            feeDetails.multiplier) /
            Math.pow(10, activeCoin.decimalPlaces) /
            Number(
              minerSettings.data.payoutLimit /
                Math.pow(10, activeCoin.decimalPlaces)
            )) *
            100,
          { style: 'decimal', maximumFractionDigits: 6 }
        ),
        ip: '',
        payoutLimit: `${
          minerSettings.data.payoutLimit /
          Math.pow(10, activeCoin.decimalPlaces)
        }`,
      }}
      validateOnChange={true}
      validate={validate}
      // validationSchema={validationSchema}
    >
      {({ values }) => {
        return (
          <>
            <Form>
              <FieldGroup.V>
                <h3>{t('dashboard:settings.payout.title')}</h3>

                {String(activeCoin?.ticker) === 'eth' && <PayoutWarning />}
                <ErrorBox error={minerSettings.error} />

                <ThresholdInput name="payoutLimit" />

                {String(activeCoin?.ticker) === 'eth' &&
                  (gweiToggle ? (
                    <GasPriceInput name="maxFeePrice" onToggle={toggleGwei} />
                  ) : (
                    <GasPricePercentInput
                      name="maxFeePricePercent"
                      onToggle={toggleGwei}
                    />
                  ))}

                <Spacer />
                <TextField
                  name="ip"
                  label={`${t('dashboard:settings.ip')}*`}
                  placeholder={minerSettings.data!.ipAddress}
                />
                <div>
                  <p>
                    <i>*{t('dashboard:settings.ip_caption')}</i>
                  </p>
                  <p>
                    {t('dashboard:settings.ip_hint')}{' '}
                    <b>{minerSettings.data!.clientIPAddress}</b>.
                  </p>
                  <p>{t('dashboard:settings.ip_description')} </p>
                </div>

                {activeCoin.ticker === 'eth' &&
                Number(values.payoutLimit) < 0.05 ? (
                  <LowPayoutContainer>
                    {t('dashboard:settings.high_fees_warning')}
                  </LowPayoutContainer>
                ) : (
                  ''
                )}
                <Submit shape="block">
                  {t('dashboard:settings.payout.submit')}
                </Submit>
              </FieldGroup.V>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default PayoutSettings;