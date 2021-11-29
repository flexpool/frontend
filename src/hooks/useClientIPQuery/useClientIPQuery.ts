import { fetchApi } from '@/utils/fetchApi';
import { useQuery } from 'react-query';

const useClientIPQuery = () => {
  return useQuery(
    ['/pool/clientIP'],
    () =>
      fetchApi<string>('/pool/clientIP', {
        method: 'POST', // Use post to avoid caching
      }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export default useClientIPQuery;
