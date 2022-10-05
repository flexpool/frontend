import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Query = {
  coin: string;
};

export const usePoolCurrentLuck = <T extends any = number>(
  query: Query,
  options?: UseQueryOptions<number, unknown, T, any>
) => {
  return useQuery(
    ['/pool/currentLuck', query],
    () => fetchApi<number>('/pool/currentLuck', { query }),
    {
      ...options,
    }
  );
};

export default usePoolCurrentLuck;
