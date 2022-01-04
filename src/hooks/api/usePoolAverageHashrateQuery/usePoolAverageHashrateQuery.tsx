import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type PoolAverageHashrateQuery = {
  coin?: string;
};

const usePoolAverageHashrateQuery = <TData extends any = number>(
  query: PoolAverageHashrateQuery,
  options?: UseQueryOptions<number, Error, TData, any>
) => {
  return useQuery(
    ['/pool/averageHashrate', query] as const,
    () =>
      fetchApi<number>('/pool/averageHashrate', {
        query,
      }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolAverageHashrateQuery;
