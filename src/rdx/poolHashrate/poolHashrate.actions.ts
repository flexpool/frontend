import { fetchApi } from 'src/utils/fetchApi';

export const poolHashrateGet = (coin: string) => {
  const init = { query: { coin } };

  return {
    type: '@poolHashrate/GET',
    payload: fetchApi('/pool/hashrateChart', init),
  };
};
