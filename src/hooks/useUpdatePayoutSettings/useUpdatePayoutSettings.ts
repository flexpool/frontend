import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { snackActions } from '@/rdx/snacks/snack.actions';
import useMinerPayoutSettingsMutation from '@/hooks/api/useMinerPayoutSettingsMutation';

const { create } = snackActions;

const useUpdatePayoutSettings = () => {
  const queryClient = useQueryClient();
  const d = useDispatch();

  return useMinerPayoutSettingsMutation({
    onSuccess: (data, query) => {
      if (data) {
        queryClient.invalidateQueries([
          '/miner/details',
          { address: query.address },
        ]);

        d(
          create({
            variant: 'success',
            title: 'Your payout settings have been updated.',
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

export default useUpdatePayoutSettings;
