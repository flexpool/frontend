import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

const useEthMergeEstimatedDate = (
  options?: UseQueryOptions<number, any, any, any>
) => {
  return useQuery(
    ['/poo/ethMergeEstimatedDate'],
    () => fetchApi<number>('/pool/ethMergeEstimatedDate'),
    {
      ...options,
    }
  );
};

export default useEthMergeEstimatedDate;
