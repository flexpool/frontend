import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiTopMiner } from '@/types/TopMiner.types';
import { Error } from '@/types/query.types';

type TopMinersQuery = {
  coin: string;
};

const useTopMinersQuery = (query: TopMinersQuery) => {
  return useQuery<ApiTopMiner[], Error>(
    ['/pool/topMiners', query],
    () =>
      fetchApi('/pool/topMiners', {
        query,
      }),
    {
      enabled: !!query.coin,
    }
  );
};

export default useTopMinersQuery;
