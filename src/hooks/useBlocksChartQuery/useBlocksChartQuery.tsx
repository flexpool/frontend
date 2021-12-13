import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiBlocksChartItem } from '@/types/PoolStats.types';
import { Error } from '@/types/query.types';

type BlocksChartQuery = {
  coin?: string;
};

const useBlocksChartQuery = (query: BlocksChartQuery) => {
  return useQuery<ApiBlocksChartItem[], Error>(
    ['/pool/blocksChart', query],
    () => fetchApi('/pool/blocksChart', { query }),
    {
      enabled: !!query.coin,
    }
  );
};

export default useBlocksChartQuery;
