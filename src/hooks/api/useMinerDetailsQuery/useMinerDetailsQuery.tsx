import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';
import { ApiMinerSettings } from 'src/types/Miner.types';

type MinerDetailsQuery = {
  coin?: string;
  address?: string;
};

const useMinerDetailsQuery = <T extends any = ApiMinerSettings>(
  query: MinerDetailsQuery,
  options?: UseQueryOptions<ApiMinerSettings, Error, T, any>
) => {
  return useQuery(
    ['/miner/details', query],
    () => fetchApi<ApiMinerSettings>('/miner/details', { query }),
    {
      enabled: !!query.coin && !!query.address,
      ...options,
    }
  );
};

export default useMinerDetailsQuery;
