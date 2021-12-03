import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiPoolCoinFull } from '@/types/PoolCoin.types';

const usePoolCoinsFullQuery = () => {
  return useQuery(
    ['/pool/coinsFull'],
    () => fetchApi<ApiPoolCoinFull[]>('/pool/coinsFull'),
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );
};

export default usePoolCoinsFullQuery;
