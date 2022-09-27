import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiBlocks } from '@/types/Miner.types';

type MinerBlocksQuery = {
  coin: string;
  page: string;
  address: string;
};

export const useMinerBlocksQuery = <T extends any = ApiBlocks>(
  query: MinerBlocksQuery,
  options?: UseQueryOptions<ApiBlocks, unknown, T, any>
) => {
  return useQuery(
    ['/miner/blocks', query],
    () => fetchApi<ApiBlocks>('/miner/blocks', { query }),
    {
      ...options,
    }
  );
};

export default useMinerBlocksQuery;
