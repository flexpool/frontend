import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerWorker } from '@/types/Miner.types';
import { Error } from '@/types/query.types';

type MinerWorkersQuery = {
  coin: string;
  address: string;
};

const useMinerWorkersQuery = <T extends any = ApiMinerWorker[]>(
  query: MinerWorkersQuery,
  options?: UseQueryOptions<ApiMinerWorker[], Error, T, any>
) => {
  return useQuery(
    ['/miner/workers', query] as const,
    () => fetchApi<ApiMinerWorker[]>('/miner/workers', { query }),
    {
      enabled: !!query.coin && !!query.address,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );
};

export default useMinerWorkersQuery;
