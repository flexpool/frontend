import { useMutation, UseMutationOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Error = {
  code: number;
  message: string;
  status: number;
};

type Response = boolean;

export type Query = {
  address: string;
  coin: string;
  payoutLimit: number;
  maxFeePrice: number;
  ipAddress: string;
  network: string;
};

const useMinerPayoutSettingsMutation = (
  options?: UseMutationOptions<Response, Error, Query>
) => {
  return useMutation(
    (query) =>
      fetchApi('/miner/payoutSettings', {
        method: 'PUT',
        query,
      }),
    {
      ...options,
    }
  );
};

export default useMinerPayoutSettingsMutation;
