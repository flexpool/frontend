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
        title: 'Your settings has been updated.',
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
