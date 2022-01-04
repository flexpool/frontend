import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type PoolWorkerCountQuery = {
  coin?: string;
};

const usePoolWorkerCountQuery = <TData extends any = number>(
  query: PoolWorkerCountQuery,
  options?: UseQueryOptions<number, Error, TData, any>
) => {
  return useQuery(
    ['/pool/workerCount', query] as const,
    () =>
      fetchApi<number>('/pool/workerCount', {
        query,
      }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolWorkerCountQuery;
