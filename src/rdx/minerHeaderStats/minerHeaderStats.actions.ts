import { ApiMinerHeaderStats } from 'src/types/Miner.types';
import { fetchApi } from 'src/utils/fetchApi';

export const minerHeaderStatsGet = (
  coin: string,
  address: string,
  counterTicker: string
) => {
  const query = {
    coin,
    address,
    countervalue: counterTicker,
  };
  return {
    type: '@minerHeaderStats/GET',
    payload: Promise.all([
      fetchApi<ApiMinerHeaderStats>('/miner/headerStats', {
        query: {
          coin,
          address,
          countervalue: counterTicker,
        },
      }),
      fetchApi<{ workersOnline: number; workersOffline: number }>(
        '/miner/workerCount',
        { query }
      ),
      fetchApi<{ balance: number; balanceCounterValue: number }>(
        '/miner/balance',
        { query }
      ),
      fetchApi<number>('/miner/roundShare', { query }),
    ]).then((res) => {
      return {
        ...res[0],
        ...res[1],
        ...res[2],
        ...(typeof res[3] === 'number'
          ? {
              roundShare: res[3],
            }
          : res[3]),
      };
    }),
  };
};
