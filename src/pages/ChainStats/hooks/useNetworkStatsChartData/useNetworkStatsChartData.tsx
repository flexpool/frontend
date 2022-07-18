import useChainStatsHistoryQuery from '@/hooks/api/useChainStatsHistoryQuery';

export type DurationKey = '1d' | '1w' | '1m' | '1y' | 'all';

const DurationQueryParams = {
  '1d': {
    duration: 'day',
    period: '10m',
  },
  '1w': {
    duration: 'week',
    period: '1h',
  },
  '1m': {
    duration: 'month',
    period: '4h',
  },
  '1y': {
    duration: 'year',
    period: '1d',
  },
  all: {
    duration: 'all',
    period: '1w',
  },
};

export const useNetworkStatsChartData = (
  coin: string,
  duration: DurationKey
) => {
  const chainStatsHistoryQuery = useChainStatsHistoryQuery(
    {
      coin: coin,
      duration: DurationQueryParams[duration].duration as any,
      period: DurationQueryParams[duration].period as any,
    },
    {
      keepPreviousData: true,
      select: (data) => {
        var userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        return data
          .map((item) => ({
            //needs to be end of day for chart to work properly
            date: new Date(item.timestamp * 1000 + userTimezoneOffset),
            difficulty: item.difficulty,
            blocktime: item.blockTime,
            hashrate: item.difficulty / item.blockTime,
          }))
          .reverse();
      },
    }
  );

  return chainStatsHistoryQuery;
};

export default useNetworkStatsChartData;
