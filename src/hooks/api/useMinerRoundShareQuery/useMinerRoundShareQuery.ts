import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerRoundShare } from '@/types/Miner.types';
import { Error } from '@/types/query.types';

type MinerRoundShareQuery = {
  coin?: string | string[];
  address?: string;
};

const useMinerRoundShareQuery = <T extends any = ApiMinerRoundShare>(
  query: MinerRoundShareQuery,
  options?: UseQueryOptions<ApiMinerRoundShare, Error, T, any>
) => {
  return useQuery(
    ['/miner/roundShare', query] as const,
    () => fetchApi<ApiMinerRoundShare>('/miner/roundShare', { query }),
    {
      enabled: !!query.coin && !!query.address,
      ...options,
    }
  );
};

export default useMinerRoundShareQuery;
