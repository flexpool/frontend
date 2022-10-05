import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Query = {
  coin: string;
};

export const usePoolNetworkHashrate = <T extends any = number>(
  query: Query,
  options?: UseQueryOptions<number, unknown, T, any>
) => {
  return useQuery(
    ['/pool/networkHashrate', query],
    () => fetchApi<number>('/pool/networkHashrate', { query }),
    {
      ...options,
    }
  );
};

export default usePoolNetworkHashrate;
