import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Error = {
  code: number;
  msg: string;
};

export const useEstimatedNextPoWRoundTimestamp = <T extends any = number>(
  coin: string,
  options?: UseQueryOptions<number, Error, T, any>
) => {
  return useQuery(
    ['/pool/estimatedNextPoWRoundTimestamp', coin],
    () =>
      fetchApi<number>('/pool/estimatedNextPoWRoundTimestamp', {
        query: {
          coin,
        },
      }),
    {
      ...options,
    }
  );
};

export default useEstimatedNextPoWRoundTimestamp;
