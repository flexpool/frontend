import { fetchApi } from 'src/utils/fetchApi';

export const topMinersGet = (coin: string) => {
  const init = { query: { coin } };

  return {
    type: '@topMiners/GET',
    payload: fetchApi('/pool/topMiners', init),
  };
};
