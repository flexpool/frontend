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
      fetchApi<{ workersOnline: number; workersOffline: number }>(
        '/miner/workerCount',
        { query }
      ),
      fetchApi<{ balance: number; balanceCountervalue: number }>(
        '/miner/balance',
        { query }
      ),
      fetchApi<number>('/miner/roundShare', { query }),
      fetchApi<number>('/pool/averageBlockReward', { query }),
    ]).then((res) => {
      return {
        ...res[0],
        ...res[1],
        roundShare: res[2],
        averageBlockShare: res[3],
      };
    }),
  };
};
