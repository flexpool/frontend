import { fetchApi } from 'src/utils/fetchApi';

export const minerRewardsGet = (
  coin: string,
  address: string,
  countervalue: string
) => {
  return {
    type: '@minerRewards/GET',
    payload: fetchApi('/miner/rewards', {
      query: { coin, address, countervalue },
    }),
  };
};
