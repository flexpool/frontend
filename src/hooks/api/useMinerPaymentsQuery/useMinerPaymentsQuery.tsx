import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerPayments } from 'src/types/Miner.types';
import { Error } from '@/types/query.types';

type MinerPaymentsQuery = {
  coin?: string;
  address?: string;
  countervalue?: string;
  page?: number;
};

const useMinerPaymentsQuery = <T extends any = ApiMinerPayments | null>(
  query: MinerPaymentsQuery,
  options?: UseQueryOptions<ApiMinerPayments | null, Error, T, any>
) => {
  return useQuery(
    ['/miner/payments', query],
    () => fetchApi<ApiMinerPayments | null>('/miner/payments', { query }),
    {
      enabled: !!query.coin && !!query.address && !!query.countervalue,
      keepPreviousData: true,
      ...options,
    }
  );
};

export default useMinerPaymentsQuery;
