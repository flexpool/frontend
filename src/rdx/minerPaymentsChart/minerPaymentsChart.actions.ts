import { fetchApi } from 'src/utils/fetchApi';

export const minerWorkersGet = (coin: string, address: string) => {
  return {
    type: '@minerWorkers/GET',
    payload: fetchApi('/miner/workers', { query: { coin, address } }),
  };
};
