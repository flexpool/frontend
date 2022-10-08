import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Query = {
  address: string;
  coin: string;
};

export const useMinerShareLogQuery = <T extends any = number[]>(
  query: Query,
  options?: UseQueryOptions<number[], unknown, T, any>
) => {
  return useQuery(
    ['/miner/shareLog', query],
    () => fetchApi<number[]>('/miner/shareLog', { query }),
    {
      ...options,
    }
  );
};

export default useMinerShareLogQuery;
