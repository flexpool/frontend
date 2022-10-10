import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { CheckboxField } from 'src/components/Form/Checkbox';
import { ErrorBox } from 'src/components/Form/ErrorBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
import ScrollIntoView from '@/components/ScrollIntoView';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import useClientIPQuery from '@/hooks/api/useClientIPQuery';
import useMinerDetailsQuery from '@/hooks/api/useMinerDetailsQuery';
import useUpdateNotificationSettings from '@/hooks/useUpdateNotificationSettings';
import OfflineDetectionDurationSlider from './components/OfflineDetectionDurationSlider';

const DEFAULT_SLIDER_OPTIONS = [
  {
    key: '5m',
    description: '5 minutes',
    value: 300,
  },
  {
    key: '10m',
    description: '10 minutes',
    value: 600,
  },
  {
    key: '20m',
    description: '20 minutes',
    value: 1200,
  },
  {
    key: '30m',
    description: '30 minutes',
    value: 1800,
  },
  {
    key: '1h',
    description: '1 hour',
    value: 3600,
  },
  {
    key: '2h',
    description: '2 hours',
    value: 7200,
  },
  {
    key: '4h',
    description: '4 hours',
    value: 14400,
  },
  {
    key: '8h',
    description: '8 hours',
    value: 28800,
  },
  {
    key: '16h',
    description: '16 hours',
    value: 57600,
  },
  {
    key: '24h',
    description: '24 hours',
    value: 86400,
  },
];

const ZIL_SLIDER_OPTIONS = [
  {
    key: '2h',
    description: '2 hours',
    value: 7200,
  },
  {
    key: '4h',
    description: '4 hours',
    value: 14400,
  },
  {
    key: '6h',
    description: '6 hours',
    value: 18000,
  },
  {
    key: '8h',
    description: '8 hours',
    value: 28800,
  },
  {
    key: '10h',
    description: '10 hours',
    value: 36000,
  },
  {
    key: '12h',
    description: '12 hours',
    value: 43200,
  },
  {
    key: '16h',
    description: '16 hours',
    value: 57600,
  },
  {
    key: '24h',
    description: '24 hours',
    value: 86400,
  },
];

const NotificationSettings: React.FC<{
  address: string;
}> = ({ address }) => {
  const activeCoin = useActiveCoin();
  const { t } = useTranslation(['common', 'dashboard']);
  const { data: minerDetails } = useMinerDetailsQuery({
    coin: activeCoin?.ticker,
    address,
  });

  const { mutateAsync, error: notificationSettingsError } =
    useUpdateNotificationSettings();

  const { data: clientIP } = useClientIPQuery();

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  if (!minerDetails || !activeCoin) {
    return null;
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const validate = (values) => {
    return sleep(100).then(() => {
      const errors = {} as {
        email: string;
        ipAddress: string;
      };

      if (values.emailEnabled && !validateEmail(values.email)) {
        errors.email = t('common:errors.email_invalid');
      }
      if (values.emailEnabled && values.email === '') {
        errors.email = t('common:errors.email_required');
      }
      if (values.ipAddress === '') {
        errors.ipAddress = t('common:errors.required');
      }

      return errors;
    });
  };

  const defaultDuration = activeCoin.ticker === 'zil' ? 18000 : 1200;

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

        return mutateAsync({
          coin: activeCoin.ticker,
          address,
          ...payload,
        });
      }}
      initialValues={{
        ipAddress: '',
        emailEnabled: !!minerDetails.notifications?.email,
        email: '',
        paymentNotifications:
          minerDetails.notificationPreferences?.payoutNotifications ?? false,
        workersOfflineNotifications:
          minerDetails.notificationPreferences?.workersOfflineNotifications ??
          false,
        workerOfflineDetectionDuration:
          minerDetails.notificationPreferences
            ?.workerOfflineDetectionDuration ?? defaultDuration,
      }}
      validateOnChange={true}
      validate={validate}
    >
      {({ values }) => {
        return (
          <Form>
            <FieldGroup.V>
              <h3>{t('dashboard:settings.notifications.title')}</h3>
              {notificationSettingsError && (
                <ScrollIntoView>
                  <ErrorBox error={notificationSettingsError} />
                </ScrollIntoView>
              )}
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
                  minerDetails.notifications?.email ||
                  t('dashboard:settings.notifications.send_to_placeholder')
                }
                disabled={!values.emailEnabled}
              />
              {activeCoin.ticker === 'zil' ? (
                <OfflineDetectionDurationSlider
                  options={ZIL_SLIDER_OPTIONS}
                  disabled={!values.emailEnabled}
                />
              ) : (
                <OfflineDetectionDurationSlider
                  options={DEFAULT_SLIDER_OPTIONS}
                  disabled={!values.emailEnabled}
                />
              )}
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
                placeholder={minerDetails.ipAddress}
                desc={
                  <p>
                    {t('dashboard:settings.ip_hint')} <b>{clientIP}</b>
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

export default NotificationSettings;
