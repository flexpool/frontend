import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerStats } from '@/types/Miner.types';

type MinerStatsQuery = {
  coin: string | string[];
  address: string;
  worker?: string;
};

type MinerStatsError = {
  status: number;
  results: null;
  error: string;
};

const useMinerStatsQuery = (query: MinerStatsQuery) => {
  return useQuery<ApiMinerStats, MinerStatsError>(
    ['/miner/stats', query] as const,
    () =>
      fetchApi('/miner/stats', {
        query,
      }),
    {
      enabled: Boolean(query.coin) && Boolean(query.address),
    }
  );
};

export default useMinerStatsQuery;
