import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Query = {
  coin: string;
};

export const usePoolNetworkDifficulty = <T extends any = number>(
  query: Query,
  options?: UseQueryOptions<number, unknown, T, any>
) => {
  return useQuery(
    ['/pool/networkDifficulty', query],
    () => fetchApi<number>('/pool/networkDifficulty', { query }),
    {
      ...options,
    }
  );
};

export default usePoolNetworkDifficulty;
