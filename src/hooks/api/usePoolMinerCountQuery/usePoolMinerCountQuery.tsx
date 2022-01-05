import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type PoolMinerCountQuery = {
  coin?: string;
};

const usePoolMinerCountQuery = <TData extends any = number>(
  query: PoolMinerCountQuery,
  options?: UseQueryOptions<number, Error, TData, any>
) => {
  return useQuery(
    ['/pool/minerCount', query] as const,
    () =>
      fetchApi<number>('/pool/minerCount', {
        query,
      }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolMinerCountQuery;
