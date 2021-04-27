import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { ErrorBox } from 'src/components/Form/ErrorBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
import {
  useActiveCoin,
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useFeePayoutLimitDetails } from 'src/hooks/useFeePayoutDetails';
import { minerDetailsUpdatePayoutSettings } from 'src/rdx/minerDetails/minerDetails.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import * as yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalizedNumberValueFormatter } from 'src/utils/si.utils';

export const PayoutSettings: React.FC = () => {
  const activeCoinTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  const minerSettings = useReduxState('minerDetails');
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const counterTicker = useCounterTicker();
  const { t } = useTranslation(['dashboard', 'common']);
  const numberFormatter = useLocalizedNumberValueFormatter();
  const d = useDispatch();
  const {
    params: { address },
  } = useRouteMatch<{ address: string; coin: string }>();

  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);

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

  return (
    <Formik
      onSubmit={async (data, { setSubmitting }) => {
        await d(
          minerDetailsUpdatePayoutSettings(activeCoin.ticker, address, {
            payoutLimit:
              data.payoutLimit * Math.pow(10, activeCoin.decimalPlaces),
            maxFeePrice: data.maxFeePrice,
            ipAddress: data.ip,
          })
        );
        setSubmitting(false);
      }}
      initialValues={{
        maxFeePrice: minerSettings.data.maxFeePrice,
        ip: '',
        payoutLimit:
          minerSettings.data.payoutLimit /
          Math.pow(10, activeCoin.decimalPlaces),
      }}
      validateOnChange={false}
      validationSchema={yup.object().shape({
        maxFeePrice: yup
          .number()
          .nullable(true)
          .min(0, t('common:errors.higher_than', { value: 0 })),
        payoutLimit: yup
          .number()
          .positive()
          .min(
            minPayoutLimit,
            t('common:errors.higher_than', { value: minPayoutLimit })
          )
          .required(),
        ip: yup.string().required(t('common:errors.required')),
      })}
    >
      {({ values }) => {
        return (
          <Form>
            <FieldGroup.V>
              <h3>{t('dashboard:settings.payout.title')}</h3>
              <ErrorBox error={minerSettings.error} />
              <TextField
                name="payoutLimit"
                label={t('dashboard:settings.payout.limit', {
                  min: minPayoutLimit,
                })}
                unit={activeCoinTicker.toUpperCase()}
                type="number"
                inputMode="decimal"
                desc={t('dashboard:settings.payout.limit_desc', {
                  value: `${
                    values.payoutLimit
                  } ${activeCoin.ticker.toUpperCase()}`,
                })}
              />
              <p></p>
              <TextField
                name="maxFeePrice"
                label={t('dashboard:settings.payout.gas_limit')}
                unit={feeDetails?.unit.toUpperCase()}
                type="number"
                inputMode="decimal"
                desc={
                  values.maxFeePrice > 0
                    ? t('dashboard:settings.payout.gas_limit_desc', {
                        value: values.maxFeePrice,
                        valueUnit: feeDetails?.unit,
                        valueTicker: getDisplayCounterTickerValue(
                          ((values.maxFeePrice *
                            activeCoin.transactionSize *
                            feeDetails.multiplier) /
                            Math.pow(10, activeCoin.decimalPlaces)) *
                            minerHeaderStats.data!.countervaluePrice,
                          counterTicker
                        ),
                        percent: numberFormatter(
                          ((values.maxFeePrice *
                            activeCoin.transactionSize *
                            feeDetails.multiplier) /
                            Math.pow(10, activeCoin.decimalPlaces) /
                            values.payoutLimit) *
                            100,
                          { style: 'percent', maximumFractionDigits: 3 }
                        ),
                      })
                    : t('dashboard:settings.payout.gas_limit_zero')
                }
              />
              <Spacer />
              <TextField
                name="ip"
                label={t('dashboard:settings.ip')}
                placeholder={minerSettings.data!.ipAddress}
              />
              <p>
                {t('dashboard:settings.ip_hint')}{' '}
                <b>{minerSettings.data!.clientIPAddress}</b>.
              </p>
              <Submit shape="block">
                {t('dashboard:settings.payout.submit')}
              </Submit>
            </FieldGroup.V>
          </Form>
        );
      }}
    </Formik>
  );
};
