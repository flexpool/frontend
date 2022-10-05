import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Query = {
  coin: string;
};

export const usePoolAverageLuckQuery = <T extends any = number>(
  query: Query,
  options?: UseQueryOptions<number, unknown, T, any>
) => {
  return useQuery(
    ['/pool/averageLuck', query],
    () => fetchApi<number>('/pool/averageLuck', { query }),
    {
      ...options,
    }
  );
};

export default usePoolAverageLuckQuery;
