import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { PaymentChartData } from '@/types/Miner.types';

type Query = {
  address: string;
  coin: string;
};

export const useMinerPaymentsChart = <T extends any = PaymentChartData>(
  query: Query,
  options?: UseQueryOptions<PaymentChartData, unknown, T, any>
) => {
  return useQuery(
    ['/miner/paymentsChart', query],
    () => fetchApi<PaymentChartData>('/miner/paymentsChart', { query }),
    {
      ...options,
    }
  );
};

export default useMinerPaymentsChart;
