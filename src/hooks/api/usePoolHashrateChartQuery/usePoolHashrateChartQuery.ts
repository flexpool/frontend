import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiPoolHashrateItem } from '@/types/PoolHashrate.types';
import { Error } from '@/types/query.types';

type PoolHashRateChartQuery = {
  coin?: string;
};

const usePoolHashrateChartQuery = <TData extends any = ApiPoolHashrateItem[]>(
  query: PoolHashRateChartQuery,
  options?: UseQueryOptions<ApiPoolHashrateItem[], Error, TData, any>
) => {
  return useQuery(
    ['/pool/hashrateChart', query],
    () => fetchApi<ApiPoolHashrateItem[]>('/pool/hashrateChart', { query }),
    {
      enabled: !!query.coin,
      ...options,
    }
  );
};

export default usePoolHashrateChartQuery;
