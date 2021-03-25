import { fetchApi } from 'src/utils/fetchApi';

export const minerHeaderStatsGet = (
  coin: string,
  address: string,
  counterTicker: string
) => {
  return {
    type: '@minerHeaderStats/GET',
    payload: fetchApi('/miner/headerStats', {
      query: {
        coin,
        address,
        countervalue: counterTicker,
      },
    }),
  };
};
