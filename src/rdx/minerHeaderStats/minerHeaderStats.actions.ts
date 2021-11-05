import { fetchApi } from 'src/utils/fetchApi';

export const minerHeaderStatsGet = (
  coin: string | string[],
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
      fetchApi<{ balance: number; balanceCountervalue: number; price: number }>(
        '/miner/balance',
        { query }
      ),
      fetchApi<number>('/miner/roundShare', { query }),
      fetchApi<number>('/pool/averageBlockReward', { query: { coin } }),
      fetchApi<number>('/pool/dailyRewardPerGigahashSec', { query: { coin } }),
    ]).then((res) => {
      return {
        ...res[0],
        countervaluePrice: res[0].price,
        roundShare: res[1],
        averageBlockShare: res[2],
        dailyRewardsPerGh: res[3],
      };
    }),
  };
};
