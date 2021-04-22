import { fetchApi } from 'src/utils/fetchApi';

export const minerDetailsGet = (coin: string, address: string) => {
  return {
    type: '@minerDetails/GET',
    payload: fetchApi('/miner/details', {
      query: {
        coin,
        address,
      },
    }),
  };
};

export const minerDetailsUpdatePayoutSettings = (
  coin: string,
  address: string,
  data: Partial<{
    payoutLimit: number;
    maxFeePrice: number;
    ipAddress: string;
  }>
) => ({
  type: '@minerDetails/UPDATE',
  meta: {
    snack: {
      success: {
        title: 'Your payout settings have been updated.',
      },
    },
  },
  payload: fetchApi('/miner/payoutSettings', {
    method: 'PUT',
    query: {
      coin,
      address,
      ...data,
    },
  }),
});

type NotificationSettingsInput =
  | {
      emailEnabled: false;
      ipAddress: string;
    }
  | {
      emailEnabled: true;
      email: string;
      workersOfflineNotifications: boolean;
      paymentNotifications: boolean;
      ipAddress: string;
    };

export const minerDetailsUpdateNotificationSettings = (
  coin: string,
  address: string,
  data: NotificationSettingsInput
) => ({
  type: '@minerDetails/UPDATE',
  meta: {
    snack: {
      success: {
        title: 'Your notification settings have been updated.',
      },
    },
  },
  payload: fetchApi('/miner/notificationSettings', {
    method: 'PUT',
    query: {
      coin,
      address,
      ...data,
    },
  }).then(() => {
    if (data.emailEnabled) {
      return {
        notifications: {
          email: data.email,
        },
        notificationPreferences: {
          payoutNotifications: data.paymentNotifications,
          workersOfflineNotifications: data.workersOfflineNotifications,
        },
      };
    } else {
      return {
        notifications: {
          email: null,
        },
        notificationPreferences: null,
      };
    }
  }),
});
