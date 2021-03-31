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
import { minerDetailsUpdatePayoutSettings } from 'src/rdx/minerDetails/minerDetails.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import * as yup from 'yup';

const feePayoutLimitDetails = {
  eth: {
    unit: 'Gwei',
    title: 'Gas Price',
    multiplier: 1000000000,
  },
};

const getFeePayoutLimitDetails = (coin: string) => {
  if (coin in feePayoutLimitDetails) {
    return feePayoutLimitDetails[coin as keyof typeof feePayoutLimitDetails];
  }
  return null;
};

export const PayoutSettings: React.FC = () => {
  const activeCoinTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  const minerSettings = useReduxState('minerDetails');
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const counterTicker = useCounterTicker();
  const d = useDispatch();
  const {
    params: { address },
  } = useRouteMatch<{ address: string; coin: string }>();

  const feeDetails = getFeePayoutLimitDetails(activeCoinTicker);

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
      validationSchema={yup.object().shape({
        maxFeePrice: yup
          .number()
          .nullable(true)
          .min(0, 'Must be higher than 0'),
        payoutLimit: yup
          .number()
          .positive()
          .min(minPayoutLimit, `Must be higher than ${minPayoutLimit}`)
          .required(),
      })}
    >
      {({ values }) => {
        return (
          <Form>
            <FieldGroup.V>
              <ErrorBox error={minerSettings.error} />
              <TextField
                name="payoutLimit"
                label={`Payout Limit (Min: ${minPayoutLimit})`}
                unit={activeCoinTicker.toUpperCase()}
                type="number"
                inputMode="decimal"
              />
              <p>
                You will be paid only after your unpaid balance will reach{' '}
                {values.payoutLimit} {activeCoin.ticker.toUpperCase()}.
              </p>
              <TextField
                name="maxFeePrice"
                label={`${feeDetails?.title} Limit`}
                unit={feeDetails?.unit}
                type="number"
                inputMode="decimal"
              />

              {values.maxFeePrice > 0 ? (
                <p>
                  Your transaction fee {feeDetails?.title.toLowerCase()} would
                  be limited to {values.maxFeePrice} {feeDetails?.unit} (
                  {getDisplayCounterTickerValue(
                    ((values.maxFeePrice *
                      activeCoin.transactionSize *
                      feeDetails.multiplier) /
                      Math.pow(10, activeCoin.decimalPlaces)) *
                      minerHeaderStats.data!.countervaluePrice,
                    counterTicker
                  )}
                  ).
                </p>
              ) : (
                <p>Your transaction fee will not be limited.</p>
              )}
              <Spacer />
              <TextField
                name="ip"
                label="Ip Address for Verification"
                placeholder={minerSettings.data!.ipAddress}
              />
              <p>
                Hint: You are visiting this webpage from{' '}
                <b>{minerSettings.data!.clientIPAddress}</b>.
              </p>
              <Submit block>Apply changes</Submit>
            </FieldGroup.V>
          </Form>
        );
      }}
    </Formik>
  );
};
