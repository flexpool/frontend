import { fetchApi } from 'src/utils/fetchApi';

export const poolCoinsGet = () => ({
  type: '@poolCoins/GET',
  payload: fetchApi('/pool/coinsFull'),
});
