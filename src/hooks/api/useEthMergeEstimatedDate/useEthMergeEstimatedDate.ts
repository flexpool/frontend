import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

const useEthMergeEstimatedDate = () => {
  return useQuery(['/poo/ethMergeEstimatedDate'], () =>
    fetchApi<number>('/pool/ethMergeEstimatedDate')
  );
};

export default useEthMergeEstimatedDate;
