import { ApiPoolStats } from 'src/types/PoolStats.types';
import { fetchApi } from 'src/utils/fetchApi';

export const poolStatsGet = (coin: string) => {
  const init = { query: { coin } };

  return {
    type: '@poolCoins/GET',
    payload: Promise.all([
      fetchApi<ApiPoolStats>('/pool/averageLuck', init),
      fetchApi<ApiPoolStats>('/pool/hashrate', init),
      fetchApi<ApiPoolStats>('/pool/minerCount', init),
      fetchApi<ApiPoolStats>('/pool/workerCount', init),
    ]),
  };
};
