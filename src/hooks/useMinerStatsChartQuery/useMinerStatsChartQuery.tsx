import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerStatsChartDataPoint } from '@/types/Miner.types';
import { Error } from '@/types/query.types';

type MinerStatsChartQuery = {
  coin?: string | string[];
  address?: string;
  worker?: string;
};

const useMinerStatsChartQuery = (query: MinerStatsChartQuery) => {
  // Response is null when miner has no stats data
  return useQuery<ApiMinerStatsChartDataPoint[] | null, Error>(
    ['/miner/chart', query],
    () =>
      fetchApi('/miner/chart', {
        query,
      }),
    {
      enabled: !!query.coin && !!query.address,
    }
  );
};

export default useMinerStatsChartQuery;
