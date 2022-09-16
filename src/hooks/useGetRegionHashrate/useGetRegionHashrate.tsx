import { useMemo } from 'react';
import { useActiveCoin } from '@/rdx/localSettings/localSettings.hooks';
import usePoolHashrateChartQuery from '@/hooks/api/usePoolHashrateChartQuery';
import { useLocalizedSiFormatter } from '@/utils/si.utils';

// convert region acronym for consistency since frontend uses
// different names for each region
const regionNameMapping = (name: string) => {
  switch (name) {
    case 'us':
      return 'na';
    case 'as':
      return 'ap';
    default:
      return name;
  }
};

const useGetRegionHashRate = () => {
  const etcCoin = useActiveCoin('etc');
  const xchCoin = useActiveCoin('xch');
  const siFormatter = useLocalizedSiFormatter();

  const { data: etc } = usePoolHashrateChartQuery(
    {
      coin: 'etc',
    },
    {
      select: (data) => {
        const { regions } = data[data.length - 1];

        return Object.keys(regions).reduce((prev, curr) => {
          const regionName = regionNameMapping(curr);

          prev[regionName] = siFormatter(regions[curr], {
            unit: etcCoin?.hashrateUnit,
          });
          return prev;
        }, {});
      },
    }
  );

  const { data: xch } = usePoolHashrateChartQuery(
    {
      coin: 'xch',
    },
    {
      select: (data) => {
        const { regions } = data[data.length - 1];

        return Object.keys(regions).reduce((prev, curr) => {
          const regionName = regionNameMapping(curr);
          prev[regionName] = siFormatter(regions[curr], {
            unit: xchCoin?.hashrateUnit,
          });
          return prev;
        }, {});
      },
    }
  );

  return useMemo(() => ({ etc, xch }), [etc, xch]);
};

export default useGetRegionHashRate;
