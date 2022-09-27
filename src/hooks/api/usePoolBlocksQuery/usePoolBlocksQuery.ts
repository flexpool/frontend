import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiBlocks } from '@/types/PoolCoin.types';

type MinerBlocksQuery = {
  coin: string;
  page: string;
  address: string;
};

export const usePoolBlocksQuery = <T extends any = ApiBlocks>(
  query: MinerBlocksQuery,
  options?: UseQueryOptions<ApiBlocks, unknown, T, any>
) => {
  return useQuery(
    ['/pool/blocks', query],
    () => fetchApi<ApiBlocks>('/pool/blocks', { query }),
    {
      ...options,
    }
  );
};

export default usePoolBlocksQuery;
