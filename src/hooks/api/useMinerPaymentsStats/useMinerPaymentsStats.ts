import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiPaymentStats } from '@/types/Miner.types';

type Query = {
  address: string;
  coin: string;
  countervalue: string;
};

export const useMinerPaymentStats = <T extends any = ApiPaymentStats>(
  query: Query,
  options?: UseQueryOptions<ApiPaymentStats, unknown, T, any>
) => {
  return useQuery(
    [],
    () => fetchApi<ApiPaymentStats>('/miner/paymentsStats', { query }),
    {
      ...options,
    }
  );
};

export default useMinerPaymentStats;
