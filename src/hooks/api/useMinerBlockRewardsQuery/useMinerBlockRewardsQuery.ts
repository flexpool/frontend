import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { RewardBlock } from '@/types/Miner.types';

type Query = {
  coin: string;
  address: string;
};

export const useMinerBlockRewardsQuery = <T extends any = RewardBlock[]>(
  query: Query,
  options?: UseQueryOptions<RewardBlock[], unknown, T, any>
) => {
  return useQuery(
    ['/miner/blockRewards', query],
    () => fetchApi<RewardBlock[]>('/miner/blockRewards', { query }),
    {
      ...options,
    }
  );
};

export default useMinerBlockRewardsQuery;
