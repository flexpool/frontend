import { fetchApi } from 'src/utils/fetchApi';

export const blocksChartGet = (coin: string) => {
  const init = { query: { coin } };

  return {
    type: '@blocksChart/GET',
    payload: fetchApi('/pool/blocksChart', init),
  };
};
