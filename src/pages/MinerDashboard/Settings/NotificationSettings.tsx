import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { CheckboxField } from 'src/components/Form/Checkbox';
import { ErrorBox } from 'src/components/Form/ErrorBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
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

export const NotificationSettings: React.FC = () => {
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
        const payload = data.emailEnabled
          ? {
              ...data,
              emailEnabled: true as true,
            }
          : {
              emailEnabled: false as false,
              ipAddress: data.ipAddress,
            };
        await d(
          minerDetailsUpdateNotificationSettings(
            activeCoin.ticker,
            address,
            payload
          )
        );
        setSubmitting(false);
      }}
      initialValues={{
        ipAddress: '',
        emailEnabled: !!minerSettings.data.notifications?.email,
        email: '',
        paymentNotifications:
          minerSettings.data.notificationPreferences?.payoutNotifications ||
          true,
        workersOfflineNotifications:
          minerSettings.data.notificationPreferences
            ?.workersOfflineNotifications || true,
      }}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {({ values }) => {
        return (
          <Form>
            <FieldGroup.V>
              <h3>Email notifications</h3>
              <ErrorBox error={minerSettings.error} />
              <CheckboxField
                label={`Email notifications ${
                  values.emailEnabled ? 'enabled' : 'disabled'
                }`}
                name="emailEnabled"
              />
              <TextField
                name="email"
                label="Send notifications to"
                type="email"
                placeholder={
                  minerSettings.data?.notifications?.email || 'your@email.co'
                }
                disabled={!values.emailEnabled}
              />

              <CheckboxField
                label="Warn me when one of my workers goes down"
                name="workersOfflineNotifications"
                disabled={!values.emailEnabled}
              />
              <CheckboxField
                label="Notify me when a payout has been sent"
                name="paymentNotifications"
                disabled={!values.emailEnabled}
              />
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
              <Submit block>Apply changes</Submit>
            </FieldGroup.V>
          </Form>
        );
      }}
    </Formik>
  );
};
