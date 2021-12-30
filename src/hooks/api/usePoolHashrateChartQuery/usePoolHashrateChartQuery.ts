import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiPoolHashrateItem } from '@/types/PoolHashrate.types';
import { Error } from '@/types/query.types';

type PoolHashRateChartQuery = {
  coin?: string;
};

const usePoolHashrateChartQuery = (query: PoolHashRateChartQuery) => {
  return useQuery<ApiPoolHashrateItem[], Error>(
    ['/pool/hashrateChart', query],
    () => fetchApi('/pool/hashrateChart', { query }),
    {
      enabled: !!query.coin,
    }
  );
};

export default usePoolHashrateChartQuery;
