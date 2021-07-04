import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
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

export const NotificationSettings: React.FC = () => {
  const activeCoin = useActiveCoin();
  const minerSettings = useReduxState('minerDetails');
  const d = useDispatch();
  const {
    params: { address },
  } = useRouteMatch<{ address: string; coin: string }>();

  const { t } = useTranslation(['common', 'dashboard']);

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
      validationSchema={yup.object().shape({
        ipAddress: yup.string().required('Required'),
        emailEnabled: yup.boolean(),
        email: yup
          .string()
          .email(t('common:errors.email_invalid'))
          .when('emailEnabled', {
            is: true,
            then: yup.string().required(t('common:errors.email_required')),
          }),
      })}
    >
      {({ values }) => {
        return (
          <Form>
            <FieldGroup.V>
              <h3>Email notifications</h3>
              <ErrorBox error={minerSettings.error} />
              <CheckboxField
                label={
                  values.emailEnabled
                    ? t('dashboard:settings.notifications.email_enabled')
                    : t('dashboard:settings.notifications.email_disabled')
                }
                name="emailEnabled"
              />
              <TextField
                name="email"
                label={t('dashboard:settings.notifications.send_to')}
                type="email"
                placeholder={
                  minerSettings.data?.notifications?.email ||
                  t('dashboard:settings.notifications.send_to_placeholder')
                }
                disabled={!values.emailEnabled}
              />

              <CheckboxField
                label={t('dashboard:settings.notifications.check_worker_down')}
                name="workersOfflineNotifications"
                disabled={!values.emailEnabled}
              />
              <CheckboxField
                label={t('dashboard:settings.notifications.check_payout_sent')}
                name="paymentNotifications"
                disabled={!values.emailEnabled}
              />
              <Spacer />
              <TextField
                name="ipAddress"
                label={t('dashboard:settings.ip')}
                placeholder={minerSettings.data!.ipAddress}
                desc={
                  <p>
                    {t('dashboard:settings.ip_hint')}{' '}
                    <b>{minerSettings.data!.clientIPAddress}</b>.
                  </p>
                }
              />
              <Submit shape="block">
                {t('dashboard:settings.notifications.submit')}
              </Submit>
            </FieldGroup.V>
          </Form>
        );
      }}
    </Formik>
  );
};
