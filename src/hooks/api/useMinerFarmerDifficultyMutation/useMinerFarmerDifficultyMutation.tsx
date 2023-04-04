import { useMutation, UseMutationOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';

type Response = boolean;

export type Query = {
  coin: string;
  newDifficulty: string;
  launcherID: string;
  loginLink: string;
};

const useMinerFarmerDifficultyMutation = (
  options?: UseMutationOptions<Response, any, Query>
) => {
  return useMutation(
    (query) =>
      fetchApi('/miner/farmerDifficulty', {
        method: 'POST',
        query,
      }),
    {
      ...options,
    }
  );
};

export default useMinerFarmerDifficultyMutation;
