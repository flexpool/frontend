import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';
import { ChainStatsHistoryItem } from '@/types/PoolStats.types';

type ChainStatsHistoryQuery = {
  coin?: string;
  duration: 'day' | 'week' | 'month' | 'year' | 'all';
  period: '10m' | '1h' | '4h' | '1d' | '1w';
};

const useChainStatsHistory = <T extends any = ChainStatsHistoryItem[]>(
  query: ChainStatsHistoryQuery,
  options?: UseQueryOptions<ChainStatsHistoryItem[], Error, T, any>
) => {
  return useQuery(
    ['/pool/chainStatsHistory', query],
    () =>
      fetchApi<ChainStatsHistoryItem[]>('/pool/chainStatsHistory', { query }),
    { enabled: Boolean(query.coin), ...options }
  );
};

export default useChainStatsHistory;
