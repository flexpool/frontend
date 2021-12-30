import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerStatsChartDataPoint } from '@/types/Miner.types';
import { Error } from '@/types/query.types';

type MinerStatsChartQuery = {
  coin?: string | string[];
  address?: string;
  worker?: string;
};

const useMinerStatsChartQuery = <
  T extends any = ApiMinerStatsChartDataPoint[] | null
>(
  query: MinerStatsChartQuery,
  options?: UseQueryOptions<ApiMinerStatsChartDataPoint[] | null, Error, T, any>
) => {
  // Response is null when miner has no stats data
  return useQuery(
    ['/miner/chart', query],
    () =>
      fetchApi<ApiMinerStatsChartDataPoint[] | null>('/miner/chart', {
        query,
      }),
    {
      enabled: !!query.coin && !!query.address,
      ...options,
    }
  );
};

export default useMinerStatsChartQuery;
