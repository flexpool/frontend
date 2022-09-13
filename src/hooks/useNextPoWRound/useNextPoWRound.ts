import { useEffect, useMemo, useState } from 'react';
import { intervalToDuration, Duration, format } from 'date-fns';
import useEstimatedNextPoWRoundTimestamp from '@/hooks/api/useEstimatedNextPoWRoundTimestamp';

const SUPPORTED_COINS = ['zil'];

export const useNextPoWRound = (coin?: string) => {
  const isCoinSupported = useMemo(
    () => SUPPORTED_COINS.includes(coin || ''),
    [coin]
  );

  const {
    data: timestamp,
    isLoading,
    refetch,
  } = useEstimatedNextPoWRoundTimestamp(coin!, {
    enabled: isCoinSupported,
  });

  const [durationToPoW, setDurationToPoW] = useState<Duration | undefined>();
  const [isInProgress, setIsInProgress] = useState(false);

  useEffect(() => {
    if (timestamp && isCoinSupported) {
      const tick = () => {
        const currentTs = Date.now();
        const powTs = timestamp * 1000;

        // 60s is time needed for PoW
        if (powTs - currentTs < 60000) {
          setIsInProgress(true);

          // extra 2s as buffer
          if (powTs - currentTs <= -20000) {
            refetch();
            setDurationToPoW(undefined);
          }
        } else {
          setIsInProgress(false);

          setDurationToPoW(
            intervalToDuration({
              start: new Date(currentTs),
              end: new Date(powTs),
            })
          );
        }
      };

      const id = setInterval(() => {
        tick();
      }, 1000);

      tick();

      return () => {
        clearInterval(id);
      };
    }
  }, [timestamp, isCoinSupported, refetch]);

  return {
    duration: durationToPoW,
    isLoading: isLoading,
    isInProgress,
    isAvailable: isCoinSupported,
  };
};

export default useNextPoWRound;
