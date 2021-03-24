import { fetchApi } from 'src/utils/fetchApi';

export const donorsGet = (coin: string) => {
  const init = { query: { coin } };

  return {
    type: '@donors/GET',
    payload: fetchApi('/pool/topDonators', init),
  };
};
