import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { fetchApi } from 'src/utils/fetchApi';

export const poolCoinsGet = () => ({
  type: '@poolCoins/GET',
  payload: fetchApi<ApiPoolCoin[]>('/pool/coinsFull'),
});
