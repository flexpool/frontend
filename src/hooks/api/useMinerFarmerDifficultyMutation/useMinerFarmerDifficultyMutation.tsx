import { useMutation, UseMutationOptions } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { Error } from '@/types/query.types';

type Response = boolean;

export type Query = {
  coin: string;
  newDifficulty: string;
  launcherID: string;
  loginLink: string;
};

const useMinerFarmerDifficultyMutation = (
  options?: UseMutationOptions<Response, Error, Query>
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
