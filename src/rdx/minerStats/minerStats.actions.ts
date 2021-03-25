import { fetchApi } from 'src/utils/fetchApi';

export const minerStatsGet = (coin: string, address: string) => {
  return {
    type: '@minerStats/GET',
    payload: fetchApi('/miner/stats', {
      query: {
        coin,
        address,
      },
    }),
  };
};
