import React from 'react';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { fetchApi } from 'src/utils/fetchApi';
import { useAsyncState } from './useAsyncState';

export const useDailyRewardPerGhState = () => {
  const dailyRewardPerGhState = useAsyncState('dailyRewGh', 0);
  const coinTicker = useActiveCoinTicker();

  React.useEffect(() => {
    dailyRewardPerGhState.start(
      fetchApi('/pool/dailyRewardPerGigahashSec', {
        query: {
          coin: coinTicker,
        },
      })
    );
  }, [coinTicker]);

  return dailyRewardPerGhState;
};
