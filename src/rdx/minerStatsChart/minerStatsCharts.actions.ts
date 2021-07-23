import { fetchApi } from 'src/utils/fetchApi';

export const minerStatsChartGet = (
  coin: string | string[],
  address: string,
  worker?: string
) => {
  return {
    type: '@ApiMinerStatsChart/GET',
    payload: fetchApi('/miner/chart', {
      query: {
        coin,
        address,
        worker,
      },
    }),
  };
};
