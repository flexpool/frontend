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
