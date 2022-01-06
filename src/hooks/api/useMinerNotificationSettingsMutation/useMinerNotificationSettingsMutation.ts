import { useMutation, UseMutationOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ErrorWithMessage } from '@/types/query.types';

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
  options?: UseMutationOptions<Response, ErrorWithMessage, BaseQuery & Query>
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
