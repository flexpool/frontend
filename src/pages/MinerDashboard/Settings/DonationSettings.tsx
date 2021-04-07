import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { Button } from 'src/components/Button';
import { ErrorBox } from 'src/components/Form/ErrorBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { minerDetailsUpdateNotificationSettings } from 'src/rdx/minerDetails/minerDetails.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  ipAddress: yup.string().required('Required'),
  emailEnabled: yup.boolean(),
  email: yup
    .string()
    .email('Invalid email address')
    .when('emailEnabled', {
      is: true,
      then: yup.string().required('Please enter email address'),
    }),
});

const SignatureGen: React.FC<{ ticker: string; address: string }> = ({
  address,
  ticker,
}) => {
  const signatureState = useAsyncState();

  return (
    <div>
      <Button shape="block">Generate Signature</Button>
    </div>
  );
};

export const PoolDonationSettings: React.FC = () => {
  const activeCoin = useActiveCoin();
  const minerSettings = useReduxState('minerDetails');
  const d = useDispatch();
  const {
    params: { address },
  } = useRouteMatch<{ address: string; coin: string }>();

  if (!minerSettings.data || !activeCoin) {
    return null;
  }

  return (
    <Formik
      onSubmit={async (data, { setSubmitting }) => {
        setSubmitting(false);
        const payload = data.emailEnabled
          ? {
              ...data,
              emailEnabled: true as true,
            }
          : {
              emailEnabled: false as false,
              ipAddress: data.ipAddress,
            };
        d(
          minerDetailsUpdateNotificationSettings(
            activeCoin.ticker,
            address,
            payload
          )
        );
      }}
      initialValues={{
        ipAddress: '',
        emailEnabled: false,
        email: '',
        paymentNotifications: false,
        workersOfflineNotifications: false,
      }}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {({ values }) => {
        return (
          <Form>
            <FieldGroup.V>
              <h3>Pool Donation</h3>
              <ErrorBox error={minerSettings.error} />
              <TextField
                name="donation"
                label="Pool donation (Pool fee)"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 1"
                unit="%"
              />

              <SignatureGen address={address} ticker={activeCoin.ticker} />
              <Spacer />
              <TextField
                name="ipAddress"
                label="Ip Address for Verification"
                placeholder={minerSettings.data!.ipAddress}
                desc={
                  <p>
                    Hint: You are visiting this webpage from{' '}
                    <b>{minerSettings.data!.clientIPAddress}</b>.
                  </p>
                }
              />
              <Submit shape="block">Apply changes</Submit>
            </FieldGroup.V>
          </Form>
        );
      }}
    </Formik>
  );
};
