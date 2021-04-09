import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { fetchApi } from 'src/utils/fetchApi';

export const poolCoinsFullGet = () => ({
  type: '@poolCoinsFull/GET',
  payload: fetchApi<ApiPoolCoin[]>('/pool/coinsFull'),
});
