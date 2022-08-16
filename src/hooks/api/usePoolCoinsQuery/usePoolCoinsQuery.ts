import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiPoolCoin } from '@/types/PoolCoin.types';

export const getPoolCoins = () => fetchApi<PoolCoinsResponse>('/pool/coins');

type PoolCoinsResponse = {
  coins: ApiPoolCoin[];
  countervalues: string[];
};

const usePoolCoinsQuery = <T extends any = PoolCoinsResponse>(
  options?: UseQueryOptions<PoolCoinsResponse, unknown, T, any>
) => {
  return useQuery(['/pool/coins'], getPoolCoins, {
    ...options,
  });
};

export default usePoolCoinsQuery;
