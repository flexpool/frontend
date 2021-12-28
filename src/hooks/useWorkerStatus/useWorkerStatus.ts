import useMinerWorkersQuery from '@/hooks/api/useMinerWorkersQuery';

/**
 * Returns the online/offline status of workers given an address
 */
const useWorkerStatus = ({
  coin,
  address,
}: {
  coin: string;
  address: string;
}) => {
  return useMinerWorkersQuery<{ online: number; offline: number }>(
    { coin, address },
    {
      select: (data) => {
        // Users who have not been mining for a long time
        // will response with null
        if (data === null) {
          return { online: 0, offline: 0 };
        }

        return data.reduce(
          (acc, curr) => {
            if (curr.isOnline) {
              return { ...acc, online: acc.online + 1 };
            } else {
              return { ...acc, offline: acc.offline + 1 };
            }
          },
          { online: 0, offline: 0 }
        );
      },
    }
  );
};

export default useWorkerStatus;
