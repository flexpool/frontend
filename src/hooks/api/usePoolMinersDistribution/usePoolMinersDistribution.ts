import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Distribution } from '@/types/PoolCoin.types';

type Query = {
  coin: string;
};

export const usePoolMinersDistribution = <T extends any = Distribution>(
  query: Query,
  options?: UseQueryOptions<Distribution, unknown, T, any>
) => {
  return useQuery(
    ['/pool/minersDistribution', query],
    () =>
      fetchApi<Distribution>('/pool/minersDistribution', {
        query,
      }),
    {
      ...options,
    }
  );
};

export default usePoolMinersDistribution;
