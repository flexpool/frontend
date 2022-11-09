import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type Endpoint = {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
  params: any;
  returnExample: any;
};

export const useApiDocQuery = <TData extends any = Endpoint[]>(
  options?: UseQueryOptions<Endpoint[], Error, TData, any>
) => {
  return useQuery(
    ['/docs.min.json'] as const,
    () =>
      fetchApi<Endpoint[]>('/docs.min.json', {
        raw: true,
      }),
    {
      ...options,
    }
  );
};

export default useApiDocQuery;
