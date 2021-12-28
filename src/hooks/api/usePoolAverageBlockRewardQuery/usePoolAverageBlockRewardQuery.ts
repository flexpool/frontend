import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type PoolAverageBlockRewardQuery = {
  coin?: string | string[];
};

const usePoolAverageBlockRewardQuery = <T extends any = number>(
  query: PoolAverageBlockRewardQuery,
  options?: UseQueryOptions<number, Error, T, any>
) => {
  return useQuery(
    ['/pool/averageBlockReward', query] as const,
    () => fetchApi<number>('/pool/averageBlockReward', { query }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolAverageBlockRewardQuery;
