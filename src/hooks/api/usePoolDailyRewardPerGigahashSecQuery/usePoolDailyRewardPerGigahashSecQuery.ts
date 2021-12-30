import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type PoolAverageBlockRewardQuery = {
  coin?: string | string[];
};

const usePoolDailyRewardPerGigahashSecQuery = <T extends any = number>(
  query: PoolAverageBlockRewardQuery,
  options?: UseQueryOptions<number, Error, T, any>
) => {
  return useQuery(
    ['/pool/dailyRewardPerGigahashSec', query] as const,
    () => fetchApi<number>('/pool/dailyRewardPerGigahashSec', { query }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolDailyRewardPerGigahashSecQuery;
