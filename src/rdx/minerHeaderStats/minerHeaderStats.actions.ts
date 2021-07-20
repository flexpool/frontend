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
      fetchApi<{ balance: number; balanceCountervalue: number; price: number }>(
        '/miner/balance',
        { query }
      ),
      fetchApi<number>('/miner/roundShare', { query }),
      fetchApi<number>('/pool/averageBlockReward', { query }),
      fetchApi<number>('/pool/dailyRewardPerGigahashSec', { query: { coin } }),
    ]).then((res) => {
      return {
        ...res[0],
        ...res[1],
        countervaluePrice: res[1].price,
        roundShare: res[2],
        averageBlockShare: res[3],
        dailyRewardsPerGh: res[4],
      };
    }),
  };
};
