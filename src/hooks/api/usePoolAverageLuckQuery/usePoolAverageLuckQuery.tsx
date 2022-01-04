import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type PoolAverageLuckQuery = {
  coin?: string;
};

const usePoolAverageLuckQuery = <TData extends any = number>(
  query: PoolAverageLuckQuery,
  options?: UseQueryOptions<number, Error, TData, any>
) => {
  return useQuery(
    ['/pool/averageLuck', query] as const,
    () =>
      fetchApi<number>('/pool/averageLuck', {
        query,
      }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolAverageLuckQuery;
