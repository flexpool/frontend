import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerRewards } from '@/types/Miner.types';

// TODO: Clean up after complete migration
type MinerRewardsError = {
  status: number;
  results: null;
  error: string;
};

type MinerRewardsQuery = {
  coin: string;
  address: string;
  countervalue: string;
};

const useMinerRewardsQuery = <TData extends any = ApiMinerRewards>(
  query: MinerRewardsQuery
) => {
  return useQuery<TData, MinerRewardsError>(
    ['/miner/rewards', query] as const,
    () =>
      fetchApi<TData>('/miner/rewards', {
        query,
      }),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

export default useMinerRewardsQuery;
