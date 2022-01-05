import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type PoolHashrateQuery = {
  coin?: string;
};

type PoolHashrateResponse = {
  total: number;
};

const usePoolHashrateQuery = <TData extends any = PoolHashrateResponse>(
  query: PoolHashrateQuery,
  options?: UseQueryOptions<PoolHashrateResponse, Error, TData, any>
) => {
  return useQuery(
    ['/pool/hashrate', query] as const,
    () =>
      fetchApi<PoolHashrateResponse>('/pool/hashrate', {
        query,
      }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolHashrateQuery;
