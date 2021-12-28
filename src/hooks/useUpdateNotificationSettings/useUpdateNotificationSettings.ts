import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { snackActions } from '@/rdx/snacks/snack.actions';
import useMinerNotificationSettingsMutation from '@/hooks/api/useMinerNotificationSettingsMutation';

const { create } = snackActions;

const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const d = useDispatch();

  return useMinerNotificationSettingsMutation({
    onSuccess: (data, query) => {
      queryClient.invalidateQueries([
        '/miner/details',
        { address: query.address },
      ]);

      d(
        create({
          variant: 'success',
          title: 'Your notification settings have been updated.',
        })
      );
    },
  });
};

export default useUpdateNotificationSettings;
