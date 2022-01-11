import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { snackActions } from '@/rdx/snacks/snack.actions';
import useMinerFarmerDifficultyMutation from '@/hooks/api/useMinerFarmerDifficultyMutation';

const { create } = snackActions;

const useUpdateFarmerDifficulty = () => {
  const queryClient = useQueryClient();
  const d = useDispatch();

  return useMinerFarmerDifficultyMutation({
    onSuccess: (data, query) => {
      if (data) {
        queryClient.invalidateQueries([
          '/miner/farmerDetail',
          { launcherID: query.launcherID },
        ]);

        d(
          create({
            variant: 'success',
            title:
              'Your difficulty settings have been updated. Please wait up to 10 minutes for the changes to be applied.',
          })
        );
      } else {
        d(
          create({
            variant: 'error',
            title: 'Something went wrong. Please try again.',
          })
        );
      }
    },
  });
};

export default useUpdateFarmerDifficulty;
