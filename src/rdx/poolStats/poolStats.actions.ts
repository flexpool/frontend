import { fetchApi } from 'src/utils/fetchApi';

export const poolStatsGet = (coin: string) => {
  const init = { query: { coin } };

  return {
    type: '@poolStats/GET',
    payload: Promise.all([
      fetchApi<number>('/pool/averageLuck', init),
      fetchApi<number>('/pool/averageHashrate', init),
      fetchApi<{
        total: number;
      }>('/pool/hashrate', init),
      fetchApi<number>('/pool/minerCount', init),
      fetchApi<number>('/pool/workerCount', init),
    ]).then((res) => ({
      averageLuck: res[0],
      averageHashrate: res[1],
      hashrate: res[2],
      minerCount: res[3],
      workerCount: res[4],
    })),
  };
};
