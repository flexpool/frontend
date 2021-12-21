import { useMutation, UseMutationOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Error = {
  code: number;
  message: string;
  status: number;
};

type Response = boolean;

type BaseQuery = {
  coin: string;
  address: string;
};

type Query =
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

const useMinerNotificationSettingsMutation = (
  options?: UseMutationOptions<Response, Error, BaseQuery & Query>
) => {
  return useMutation(
    (query) =>
      fetchApi('/miner/notificationSettings', {
        method: 'PUT',
        query,
      }),
    {
      ...options,
    }
  );
};

export default useMinerNotificationSettingsMutation;
