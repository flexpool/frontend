import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiPoolCoin } from '@/types/PoolCoin.types';

export const getPoolCoins = () => fetchApi<PoolCoinsResponse>('/pool/coins');

type PoolCoinsResponse = {
  coins: ApiPoolCoin[];
  countervalues: string[];
};

const usePoolCoinsQuery = () => {
  return useQuery(['/pool/coins'], getPoolCoins);
};

export default usePoolCoinsQuery;
