import { useQuery, UseQueryOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiMinerFarmerDifficulty } from '@/types/Miner.types';
import { Error } from '@/types/query.types';

type MinerFarmerDifficultyQuery = {
  launcherID?: string;
};

const useMinerFarmerDifficultyQuery = <
  T extends any = ApiMinerFarmerDifficulty
>(
  query: MinerFarmerDifficultyQuery,
  options?: UseQueryOptions<ApiMinerFarmerDifficulty, Error, T, any>
) => {
  return useQuery(
    ['miner/farmerDifficulty', query],
    () =>
      fetchApi<ApiMinerFarmerDifficulty>('/miner/farmerDifficulty', {
        query: { ...query, coin: 'xch' },
      }),
    {
      enabled: !!query.launcherID,
      ...options,
    }
  );
};

export default useMinerFarmerDifficultyQuery;
