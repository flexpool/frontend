import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerBalance } from '@/types/Miner.types';
import { Error } from '@/types/query.types';

type MinerBalanceQuery = {
  coin?: string | string[];
  address?: string;
  countervalue?: string;
};

const useMinerBalanceQuery = <T extends any = ApiMinerBalance>(
  query: MinerBalanceQuery,
  options?: UseQueryOptions<ApiMinerBalance, Error, T, any>
) => {
  return useQuery(
    ['/miner/balance', query] as const,
    () => fetchApi<ApiMinerBalance>('/miner/balance', { query }),
    {
      enabled: !!query.coin && !!query.address && !!query.countervalue,
      ...options,
    }
  );
};

export default useMinerBalanceQuery;
